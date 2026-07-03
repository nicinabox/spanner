# frozen_string_literal: true

class EmailChangeMailer < ApplicationMailer
  # Sent to the NEW (unconfirmed) email address with a confirmation link.
  def confirm_email(user)
    @user = user
    @expires_at = expires_time
    mail to: @user.unconfirmed_email,
         subject: "Confirm your new email for Spanner (expires #{@expires_at})"
  end

  # Sent to the OLD (current) email address to notify the user that an
  # email change was requested. This protects against silent account
  # takeover.
  def notify_old_email(user)
    @user = user
    mail to: @user.email,
         subject: 'An email change was requested for your Spanner account'
  end

  private

  def expires_time
    now = Time.now.in_time_zone @user.time_zone
    time = now + User::EMAIL_CONFIRMATION_TOKEN_TTL
    time.to_fs :short
  end
end
