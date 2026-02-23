use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnT");

/// Rally Stream — Real-time payment streaming on Solana.
/// Sender deposits funds upfront; recipient withdraws accumulated amount over time.
#[program]
pub mod rally_stream {
    use super::*;

    /// Create a new payment stream. Funds are deposited into a vault PDA.
    pub fn create_stream(
        ctx: Context<CreateStream>,
        stream_id: u64,
        amount_per_second: u64,
        start_time: i64,
        end_time: i64,
    ) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        require!(start_time >= now - 60, StreamError::InvalidStartTime); // Allow 60s grace
        require!(end_time > start_time, StreamError::InvalidEndTime);
        require!(amount_per_second > 0, StreamError::InvalidRate);

        let duration = (end_time - start_time) as u64;
        let total_deposit = amount_per_second.checked_mul(duration)
            .ok_or(StreamError::Overflow)?;

        require!(total_deposit > 0, StreamError::InvalidAmount);

        // Transfer total deposit from sender to stream vault
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.sender.to_account_info(),
                    to: ctx.accounts.stream_vault.to_account_info(),
                },
            ),
            total_deposit,
        )?;

        let stream = &mut ctx.accounts.stream;
        stream.sender = ctx.accounts.sender.key();
        stream.recipient = ctx.accounts.recipient.key();
        stream.stream_id = stream_id;
        stream.amount_per_second = amount_per_second;
        stream.start_time = start_time;
        stream.end_time = end_time;
        stream.total_deposited = total_deposit;
        stream.total_withdrawn = 0;
        stream.is_cancelled = false;
        stream.vault_bump = ctx.bumps.stream_vault;
        stream.created_at = now;

        msg!(
            "Stream created: {} lamports/sec from {} to {}, duration {} sec",
            amount_per_second,
            stream.sender,
            stream.recipient,
            duration
        );
        Ok(())
    }

    /// Recipient withdraws accumulated streamed funds.
    pub fn withdraw_from_stream(ctx: Context<WithdrawFromStream>) -> Result<()> {
        let stream = &mut ctx.accounts.stream;
        let now = Clock::get()?.unix_timestamp;

        require!(!stream.is_cancelled, StreamError::StreamCancelled);
        require!(
            ctx.accounts.recipient.key() == stream.recipient,
            StreamError::Unauthorized
        );

        // Calculate elapsed time (capped at end_time)
        let effective_time = now.min(stream.end_time);
        let elapsed = (effective_time - stream.start_time).max(0) as u64;
        let total_earned = stream.amount_per_second.checked_mul(elapsed)
            .ok_or(StreamError::Overflow)?;
        let withdrawable = total_earned.checked_sub(stream.total_withdrawn)
            .ok_or(StreamError::Overflow)?;

        require!(withdrawable > 0, StreamError::NothingToWithdraw);

        // Transfer from vault to recipient
        let vault_balance = ctx.accounts.stream_vault.lamports();
        let transfer_amount = withdrawable.min(vault_balance);

        **ctx.accounts.stream_vault.to_account_info().try_borrow_mut_lamports()? -= transfer_amount;
        **ctx.accounts.recipient.to_account_info().try_borrow_mut_lamports()? += transfer_amount;

        stream.total_withdrawn = stream.total_withdrawn.checked_add(transfer_amount)
            .ok_or(StreamError::Overflow)?;

        msg!("Withdrew {} lamports from stream", transfer_amount);
        Ok(())
    }

    /// Sender cancels the stream. Unstreamed funds are returned to sender.
    pub fn cancel_stream(ctx: Context<CancelStream>) -> Result<()> {
        let stream = &mut ctx.accounts.stream;
        let now = Clock::get()?.unix_timestamp;

        require!(!stream.is_cancelled, StreamError::StreamCancelled);
        require!(
            ctx.accounts.sender.key() == stream.sender,
            StreamError::Unauthorized
        );

        // Calculate how much the recipient has earned up to now
        let effective_time = now.min(stream.end_time);
        let elapsed = (effective_time - stream.start_time).max(0) as u64;
        let total_earned = stream.amount_per_second.checked_mul(elapsed)
            .ok_or(StreamError::Overflow)?;

        // Amount owed to recipient (not yet withdrawn)
        let owed_to_recipient = total_earned.saturating_sub(stream.total_withdrawn);

        // Remaining in vault
        let vault_balance = ctx.accounts.stream_vault.lamports();

        // Pay recipient what they're owed
        if owed_to_recipient > 0 && vault_balance > 0 {
            let pay_recipient = owed_to_recipient.min(vault_balance);
            **ctx.accounts.stream_vault.to_account_info().try_borrow_mut_lamports()? -= pay_recipient;
            **ctx.accounts.recipient.to_account_info().try_borrow_mut_lamports()? += pay_recipient;
            stream.total_withdrawn = stream.total_withdrawn.checked_add(pay_recipient)
                .ok_or(StreamError::Overflow)?;
        }

        // Return remaining funds to sender
        let remaining = ctx.accounts.stream_vault.lamports();
        if remaining > 0 {
            **ctx.accounts.stream_vault.to_account_info().try_borrow_mut_lamports()? -= remaining;
            **ctx.accounts.sender.to_account_info().try_borrow_mut_lamports()? += remaining;
        }

        stream.is_cancelled = true;
        msg!("Stream cancelled. Returned {} lamports to sender", remaining);
        Ok(())
    }
}

// === Accounts ===

#[derive(Accounts)]
#[instruction(stream_id: u64)]
pub struct CreateStream<'info> {
    #[account(
        init,
        payer = sender,
        space = PaymentStream::SPACE,
        seeds = [b"stream", sender.key().as_ref(), stream_id.to_le_bytes().as_ref()],
        bump
    )]
    pub stream: Account<'info, PaymentStream>,

    /// CHECK: PDA vault that holds streamed funds
    #[account(
        mut,
        seeds = [b"stream_vault", stream.key().as_ref()],
        bump
    )]
    pub stream_vault: SystemAccount<'info>,

    /// CHECK: Recipient of the payment stream
    pub recipient: UncheckedAccount<'info>,

    #[account(mut)]
    pub sender: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawFromStream<'info> {
    #[account(mut)]
    pub stream: Account<'info, PaymentStream>,

    /// CHECK: PDA vault
    #[account(
        mut,
        seeds = [b"stream_vault", stream.key().as_ref()],
        bump = stream.vault_bump
    )]
    pub stream_vault: SystemAccount<'info>,

    #[account(mut)]
    pub recipient: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelStream<'info> {
    #[account(mut)]
    pub stream: Account<'info, PaymentStream>,

    /// CHECK: PDA vault
    #[account(
        mut,
        seeds = [b"stream_vault", stream.key().as_ref()],
        bump = stream.vault_bump
    )]
    pub stream_vault: SystemAccount<'info>,

    #[account(mut)]
    pub sender: Signer<'info>,

    /// CHECK: Recipient gets owed funds on cancel
    #[account(mut)]
    pub recipient: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

// === State ===

#[account]
pub struct PaymentStream {
    pub sender: Pubkey,           // 32
    pub recipient: Pubkey,        // 32
    pub stream_id: u64,           // 8
    pub amount_per_second: u64,   // 8
    pub start_time: i64,          // 8
    pub end_time: i64,            // 8
    pub total_deposited: u64,     // 8
    pub total_withdrawn: u64,     // 8
    pub is_cancelled: bool,       // 1
    pub vault_bump: u8,           // 1
    pub created_at: i64,          // 8
}

impl PaymentStream {
    pub const SPACE: usize = 8 + 32 + 32 + 8 + 8 + 8 + 8 + 8 + 8 + 1 + 1 + 8 + 32; // + padding
}

// === Errors ===

#[error_code]
pub enum StreamError {
    #[msg("Start time cannot be in the past")]
    InvalidStartTime,
    #[msg("End time must be after start time")]
    InvalidEndTime,
    #[msg("Rate must be greater than 0")]
    InvalidRate,
    #[msg("Amount must be greater than 0")]
    InvalidAmount,
    #[msg("Stream has been cancelled")]
    StreamCancelled,
    #[msg("Unauthorized: only sender/recipient can perform this action")]
    Unauthorized,
    #[msg("Nothing to withdraw yet")]
    NothingToWithdraw,
    #[msg("Arithmetic overflow")]
    Overflow,
}
