use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnU");

/// Rally Vote — On-chain proposal and voting for squad governance.
/// Members create proposals to spend squad funds; squad votes to approve.
#[program]
pub mod rally_vote {
    use super::*;

    /// Create a proposal for a squad spending decision.
    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        proposal_id: u64,
        title: String,
        description: String,
        amount: u64,
        recipient: Pubkey,
        voting_deadline: i64,
    ) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        require!(title.len() <= 64, VoteError::TitleTooLong);
        require!(description.len() <= 256, VoteError::DescriptionTooLong);
        require!(voting_deadline > now, VoteError::DeadlineInPast);
        require!(amount > 0, VoteError::InvalidAmount);

        let proposal = &mut ctx.accounts.proposal;
        proposal.squad = ctx.accounts.squad.key();
        proposal.proposer = ctx.accounts.proposer.key();
        proposal.proposal_id = proposal_id;
        proposal.title = title;
        proposal.description = description;
        proposal.amount = amount;
        proposal.recipient = recipient;
        proposal.yes_votes = 0;
        proposal.no_votes = 0;
        proposal.voters = vec![];
        proposal.voting_deadline = voting_deadline;
        proposal.is_executed = false;
        proposal.created_at = now;

        msg!("Proposal '{}' created for {} lamports", proposal.title, amount);
        Ok(())
    }

    /// Cast a vote (yes or no) on a proposal. Each member votes once.
    pub fn cast_vote(ctx: Context<CastVote>, vote_yes: bool) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        let proposal = &mut ctx.accounts.proposal;
        let voter = ctx.accounts.voter.key();

        require!(now <= proposal.voting_deadline, VoteError::VotingClosed);
        require!(!proposal.is_executed, VoteError::AlreadyExecuted);
        require!(
            !proposal.voters.contains(&voter),
            VoteError::AlreadyVoted
        );

        // Record the vote
        proposal.voters.push(voter);
        if vote_yes {
            proposal.yes_votes = proposal.yes_votes.checked_add(1)
                .ok_or(VoteError::Overflow)?;
        } else {
            proposal.no_votes = proposal.no_votes.checked_add(1)
                .ok_or(VoteError::Overflow)?;
        }

        msg!(
            "Vote cast: {} by {}. Tally: {} yes, {} no",
            if vote_yes { "YES" } else { "NO" },
            voter,
            proposal.yes_votes,
            proposal.no_votes
        );
        Ok(())
    }

    /// Execute a proposal if it has passed.
    /// A proposal passes when: deadline reached + yes > no + yes >= (total_members/2 + 1)
    pub fn execute_proposal(
        ctx: Context<ExecuteProposal>,
        total_squad_members: u8,
    ) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        let proposal = &mut ctx.accounts.proposal;

        require!(!proposal.is_executed, VoteError::AlreadyExecuted);
        require!(now >= proposal.voting_deadline, VoteError::VotingStillOpen);

        // Check quorum: yes votes must be > 50% of total members
        let quorum = (total_squad_members as u32 / 2) + 1;
        require!(
            proposal.yes_votes >= quorum,
            VoteError::QuorumNotReached
        );
        require!(
            proposal.yes_votes > proposal.no_votes,
            VoteError::ProposalRejected
        );

        proposal.is_executed = true;

        msg!(
            "Proposal '{}' executed! {} yes vs {} no (quorum: {})",
            proposal.title,
            proposal.yes_votes,
            proposal.no_votes,
            quorum
        );
        Ok(())
    }
}

// === Accounts ===

#[derive(Accounts)]
#[instruction(proposal_id: u64)]
pub struct CreateProposal<'info> {
    #[account(
        init,
        payer = proposer,
        space = Proposal::SPACE,
        seeds = [b"proposal", squad.key().as_ref(), proposal_id.to_le_bytes().as_ref()],
        bump
    )]
    pub proposal: Account<'info, Proposal>,

    /// CHECK: The squad this proposal belongs to
    pub squad: UncheckedAccount<'info>,

    #[account(mut)]
    pub proposer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,

    pub voter: Signer<'info>,
}

#[derive(Accounts)]
pub struct ExecuteProposal<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,

    pub executor: Signer<'info>,
}

// === State ===

#[account]
pub struct Proposal {
    pub squad: Pubkey,            // 32
    pub proposer: Pubkey,         // 32
    pub proposal_id: u64,         // 8
    pub title: String,            // 4 + 64
    pub description: String,      // 4 + 256
    pub amount: u64,              // 8
    pub recipient: Pubkey,        // 32
    pub yes_votes: u32,           // 4
    pub no_votes: u32,            // 4
    pub voters: Vec<Pubkey>,      // 4 + (32 * 10)
    pub voting_deadline: i64,     // 8
    pub is_executed: bool,        // 1
    pub created_at: i64,          // 8
}

impl Proposal {
    pub const SPACE: usize = 8 +   // discriminator
        32 +    // squad
        32 +    // proposer
        8 +     // proposal_id
        (4 + 64) +  // title
        (4 + 256) + // description
        8 +     // amount
        32 +    // recipient
        4 +     // yes_votes
        4 +     // no_votes
        (4 + 32 * 10) + // voters (max 10)
        8 +     // voting_deadline
        1 +     // is_executed
        8 +     // created_at
        64;     // padding
}

// === Errors ===

#[error_code]
pub enum VoteError {
    #[msg("Title must be 64 characters or less")]
    TitleTooLong,
    #[msg("Description must be 256 characters or less")]
    DescriptionTooLong,
    #[msg("Voting deadline must be in the future")]
    DeadlineInPast,
    #[msg("Amount must be greater than 0")]
    InvalidAmount,
    #[msg("Voting period has ended")]
    VotingClosed,
    #[msg("Voting period is still open")]
    VotingStillOpen,
    #[msg("You have already voted on this proposal")]
    AlreadyVoted,
    #[msg("Proposal has already been executed")]
    AlreadyExecuted,
    #[msg("Quorum not reached: not enough yes votes")]
    QuorumNotReached,
    #[msg("Proposal rejected: more no votes than yes votes")]
    ProposalRejected,
    #[msg("Arithmetic overflow")]
    Overflow,
}
