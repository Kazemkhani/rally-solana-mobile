use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

/// Rally Squad — Multisig-lite shared wallets for group finance.
/// Members can spend below threshold freely; above threshold requires a vote.
#[program]
pub mod rally_squad {
    use super::*;

    /// Create a new squad with a shared vault.
    pub fn initialize_squad(
        ctx: Context<InitializeSquad>,
        name: String,
        members: Vec<Pubkey>,
        spend_threshold: u64,
    ) -> Result<()> {
        require!(name.len() <= 32, RallySquadError::NameTooLong);
        require!(members.len() <= 10, RallySquadError::TooManyMembers);
        require!(spend_threshold > 0, RallySquadError::InvalidThreshold);

        let squad = &mut ctx.accounts.squad;
        squad.authority = ctx.accounts.authority.key();
        squad.name = name;
        squad.members = members;
        squad.vault_bump = ctx.bumps.vault;
        squad.spend_threshold = spend_threshold;
        squad.total_deposited = 0;
        squad.created_at = Clock::get()?.unix_timestamp;

        // Ensure authority is in members list
        if !squad.members.contains(&squad.authority) {
            squad.members.push(squad.authority);
        }

        msg!("Squad '{}' created with {} members", squad.name, squad.members.len());
        Ok(())
    }

    /// Add a member to the squad. Only the authority can do this.
    pub fn add_member(ctx: Context<ManageMember>, new_member: Pubkey) -> Result<()> {
        let squad = &mut ctx.accounts.squad;
        require!(squad.members.len() < 10, RallySquadError::TooManyMembers);
        require!(
            !squad.members.contains(&new_member),
            RallySquadError::AlreadyMember
        );

        squad.members.push(new_member);
        msg!("Member {} added to squad", new_member);
        Ok(())
    }

    /// Remove a member from the squad. Only the authority can do this.
    pub fn remove_member(ctx: Context<ManageMember>, member: Pubkey) -> Result<()> {
        let squad = &mut ctx.accounts.squad;
        require!(
            member != squad.authority,
            RallySquadError::CannotRemoveAuthority
        );
        let initial_len = squad.members.len();
        squad.members.retain(|m| *m != member);
        require!(
            squad.members.len() < initial_len,
            RallySquadError::NotAMember
        );

        msg!("Member {} removed from squad", member);
        Ok(())
    }

    /// Deposit SOL into the squad vault. Any member can deposit.
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        require!(amount > 0, RallySquadError::InvalidAmount);

        let depositor = &ctx.accounts.depositor;
        let squad = &mut ctx.accounts.squad;

        require!(
            squad.members.contains(&depositor.key()),
            RallySquadError::NotAMember
        );

        // Transfer SOL from depositor to vault
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: depositor.to_account_info(),
                    to: ctx.accounts.vault.to_account_info(),
                },
            ),
            amount,
        )?;

        squad.total_deposited = squad.total_deposited.checked_add(amount)
            .ok_or(RallySquadError::Overflow)?;

        msg!("Deposited {} lamports to squad vault", amount);
        Ok(())
    }

    /// Withdraw SOL from the squad vault.
    /// Below spend_threshold: any member can withdraw.
    /// Above spend_threshold: requires a passed vote (caller must verify off-chain).
    pub fn withdraw(
        ctx: Context<Withdraw>,
        amount: u64,
        _vote_passed: bool, // Simplified for hackathon; production would CPI to vote program
    ) -> Result<()> {
        require!(amount > 0, RallySquadError::InvalidAmount);

        let squad = &ctx.accounts.squad;
        let withdrawer = &ctx.accounts.withdrawer;

        require!(
            squad.members.contains(&withdrawer.key()),
            RallySquadError::NotAMember
        );

        // Check if amount is below threshold (free spend) or requires vote
        if amount > squad.spend_threshold {
            require!(_vote_passed, RallySquadError::VoteRequired);
        }

        // Transfer SOL from vault to recipient
        let squad_key = squad.key();
        let vault_seeds = &[
            b"vault",
            squad_key.as_ref(),
            &[squad.vault_bump],
        ];
        let signer_seeds = &[&vault_seeds[..]];

        let vault_balance = ctx.accounts.vault.lamports();
        require!(vault_balance >= amount, RallySquadError::InsufficientFunds);

        **ctx.accounts.vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.recipient.to_account_info().try_borrow_mut_lamports()? += amount;

        msg!("Withdrew {} lamports from squad vault", amount);
        Ok(())
    }
}

// === Accounts ===

#[derive(Accounts)]
#[instruction(name: String, members: Vec<Pubkey>)]
pub struct InitializeSquad<'info> {
    #[account(
        init,
        payer = authority,
        space = Squad::space(members.len()),
        seeds = [b"squad", authority.key().as_ref()],
        bump
    )]
    pub squad: Account<'info, Squad>,

    /// CHECK: PDA vault account, just holds SOL
    #[account(
        mut,
        seeds = [b"vault", squad.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ManageMember<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    pub squad: Account<'info, Squad>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub squad: Account<'info, Squad>,

    /// CHECK: PDA vault
    #[account(
        mut,
        seeds = [b"vault", squad.key().as_ref()],
        bump = squad.vault_bump
    )]
    pub vault: SystemAccount<'info>,

    #[account(mut)]
    pub depositor: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub squad: Account<'info, Squad>,

    /// CHECK: PDA vault
    #[account(
        mut,
        seeds = [b"vault", squad.key().as_ref()],
        bump = squad.vault_bump
    )]
    pub vault: SystemAccount<'info>,

    #[account(mut)]
    pub withdrawer: Signer<'info>,

    /// CHECK: Recipient of the withdrawal
    #[account(mut)]
    pub recipient: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

// === State ===

#[account]
pub struct Squad {
    pub authority: Pubkey,       // 32
    pub name: String,            // 4 + 32 max
    pub members: Vec<Pubkey>,    // 4 + (32 * 10) max
    pub vault_bump: u8,          // 1
    pub spend_threshold: u64,    // 8
    pub total_deposited: u64,    // 8
    pub created_at: i64,         // 8
}

impl Squad {
    pub fn space(num_members: usize) -> usize {
        8 +      // discriminator
        32 +     // authority
        (4 + 32) + // name (string)
        (4 + 32 * (num_members + 1).min(10)) + // members vec
        1 +      // vault_bump
        8 +      // spend_threshold
        8 +      // total_deposited
        8 +      // created_at
        64       // padding for realloc
    }
}

// === Errors ===

#[error_code]
pub enum RallySquadError {
    #[msg("Squad name must be 32 characters or less")]
    NameTooLong,
    #[msg("Squad can have at most 10 members")]
    TooManyMembers,
    #[msg("Spend threshold must be greater than 0")]
    InvalidThreshold,
    #[msg("Amount must be greater than 0")]
    InvalidAmount,
    #[msg("User is already a member of this squad")]
    AlreadyMember,
    #[msg("User is not a member of this squad")]
    NotAMember,
    #[msg("Cannot remove the squad authority")]
    CannotRemoveAuthority,
    #[msg("Insufficient funds in squad vault")]
    InsufficientFunds,
    #[msg("Withdrawal above threshold requires a passed vote")]
    VoteRequired,
    #[msg("Arithmetic overflow")]
    Overflow,
}
