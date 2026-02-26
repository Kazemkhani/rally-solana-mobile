import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, LAMPORTS_PER_SOL, SystemProgram, PublicKey } from "@solana/web3.js";
import { assert } from "chai";

describe("rally-squad", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.RallySquad as Program;
  const authority = provider.wallet as anchor.Wallet;
  const member1 = Keypair.generate();
  const member2 = Keypair.generate();

  let squadPda: PublicKey;
  let vaultPda: PublicKey;
  let squadBump: number;
  let vaultBump: number;

  before(async () => {
    // Derive PDAs
    [squadPda, squadBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("squad"), authority.publicKey.toBuffer()],
      program.programId
    );
    [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), squadPda.toBuffer()],
      program.programId
    );

    // Airdrop SOL for testing
    const sig = await provider.connection.requestAirdrop(
      authority.publicKey,
      10 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig);
  });

  it("initializes a squad", async () => {
    const name = "Test Squad";
    const members = [member1.publicKey, member2.publicKey];
    const threshold = new anchor.BN(LAMPORTS_PER_SOL); // 1 SOL threshold

    await program.methods
      .initializeSquad(name, members, threshold)
      .accounts({
        squad: squadPda,
        vault: vaultPda,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const squad = await program.account.squad.fetch(squadPda);
    assert.equal(squad.name, name);
    assert.equal(squad.members.length, 3); // 2 members + authority
    assert.ok(squad.spendThreshold.eq(threshold));
    assert.equal(squad.totalDeposited.toNumber(), 0);
  });

  it("deposits SOL into squad vault", async () => {
    const depositAmount = new anchor.BN(2 * LAMPORTS_PER_SOL);

    await program.methods
      .deposit(depositAmount)
      .accounts({
        squad: squadPda,
        vault: vaultPda,
        depositor: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const squad = await program.account.squad.fetch(squadPda);
    assert.ok(squad.totalDeposited.eq(depositAmount));

    const vaultBalance = await provider.connection.getBalance(vaultPda);
    assert.ok(vaultBalance >= depositAmount.toNumber());
  });

  it("withdraws SOL below threshold without vote", async () => {
    const withdrawAmount = new anchor.BN(0.5 * LAMPORTS_PER_SOL);
    const recipient = Keypair.generate();

    const balanceBefore = await provider.connection.getBalance(recipient.publicKey);

    await program.methods
      .withdraw(withdrawAmount, false) // no vote needed, below threshold
      .accounts({
        squad: squadPda,
        vault: vaultPda,
        withdrawer: authority.publicKey,
        recipient: recipient.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const balanceAfter = await provider.connection.getBalance(recipient.publicKey);
    assert.ok(balanceAfter > balanceBefore);
  });

  it("rejects withdrawal above threshold without vote", async () => {
    const withdrawAmount = new anchor.BN(1.5 * LAMPORTS_PER_SOL); // above 1 SOL threshold
    const recipient = Keypair.generate();

    try {
      await program.methods
        .withdraw(withdrawAmount, false) // no vote
        .accounts({
          squad: squadPda,
          vault: vaultPda,
          withdrawer: authority.publicKey,
          recipient: recipient.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      assert.fail("Should have thrown");
    } catch (err: any) {
      assert.include(err.toString(), "VoteRequired");
    }
  });

  it("adds a new member", async () => {
    const newMember = Keypair.generate();

    await program.methods
      .addMember(newMember.publicKey)
      .accounts({
        squad: squadPda,
        authority: authority.publicKey,
      })
      .rpc();

    const squad = await program.account.squad.fetch(squadPda);
    assert.equal(squad.members.length, 4);
  });
});

describe("rally-stream", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.RallyStream as Program;
  const sender = provider.wallet as anchor.Wallet;
  const recipient = Keypair.generate();
  const streamId = Keypair.generate();

  let streamPda: PublicKey;
  let vaultPda: PublicKey;

  before(async () => {
    [streamPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("stream"), streamId.publicKey.toBuffer()],
      program.programId
    );
    [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("stream_vault"), streamPda.toBuffer()],
      program.programId
    );

    const sig = await provider.connection.requestAirdrop(
      sender.publicKey,
      10 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig);
  });

  it("creates a payment stream", async () => {
    const now = Math.floor(Date.now() / 1000);
    const rate = new anchor.BN(1000); // lamports per second
    const startTime = new anchor.BN(now);
    const endTime = new anchor.BN(now + 3600); // 1 hour stream

    await program.methods
      .createStream(streamId.publicKey, recipient.publicKey, rate, startTime, endTime)
      .accounts({
        stream: streamPda,
        vault: vaultPda,
        sender: sender.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const stream = await program.account.paymentStream.fetch(streamPda);
    assert.equal(stream.sender.toBase58(), sender.publicKey.toBase58());
    assert.equal(stream.recipient.toBase58(), recipient.publicKey.toBase58());
    assert.ok(stream.amountPerSecond.eq(rate));
    assert.equal(stream.isCancelled, false);
  });
});

describe("rally-vote", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.RallyVote as Program;
  const proposer = provider.wallet as anchor.Wallet;
  const squadKey = Keypair.generate(); // Mock squad key for testing
  const proposalId = Keypair.generate();
  const recipient = Keypair.generate();

  let proposalPda: PublicKey;

  before(async () => {
    [proposalPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("proposal"), proposalId.publicKey.toBuffer()],
      program.programId
    );

    const sig = await provider.connection.requestAirdrop(
      proposer.publicKey,
      5 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig);
  });

  it("creates a spending proposal", async () => {
    const deadline = new anchor.BN(Math.floor(Date.now() / 1000) + 86400); // 24h
    const amount = new anchor.BN(LAMPORTS_PER_SOL);

    await program.methods
      .createProposal(
        proposalId.publicKey,
        "Buy new equipment",
        "Need a projector for meetings",
        amount,
        recipient.publicKey,
        deadline,
        3 // total members for quorum
      )
      .accounts({
        proposal: proposalPda,
        squad: squadKey.publicKey,
        proposer: proposer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const proposal = await program.account.proposal.fetch(proposalPda);
    assert.equal(proposal.title, "Buy new equipment");
    assert.ok(proposal.amount.eq(amount));
    assert.equal(proposal.isExecuted, false);
    assert.equal(proposal.yesVotes, 0);
    assert.equal(proposal.noVotes, 0);
  });

  it("casts a vote on proposal", async () => {
    await program.methods
      .castVote(true)
      .accounts({
        proposal: proposalPda,
        voter: proposer.publicKey,
      })
      .rpc();

    const proposal = await program.account.proposal.fetch(proposalPda);
    assert.equal(proposal.yesVotes, 1);
    assert.equal(proposal.voters.length, 1);
  });

  it("prevents double voting", async () => {
    try {
      await program.methods
        .castVote(true)
        .accounts({
          proposal: proposalPda,
          voter: proposer.publicKey,
        })
        .rpc();
      assert.fail("Should have thrown");
    } catch (err: any) {
      assert.include(err.toString(), "AlreadyVoted");
    }
  });
});
