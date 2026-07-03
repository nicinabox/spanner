# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/email_change_mailer
class EmailChangeMailerPreview < ActionMailer::Preview
  def confirm_email
    user = User.first
    user.assign_attributes(
      unconfirmed_email: 'new-email@example.com',
      email_confirmation_token: SecureRandom.urlsafe_base64,
      email_confirmation_token_valid_until: 15.minutes.from_now
    )
    EmailChangeMailer.confirm_email(user)
  end

  def notify_old_email
    user = User.first
    user.assign_attributes(
      unconfirmed_email: 'new-email@example.com',
      email_confirmation_token: SecureRandom.urlsafe_base64,
      email_confirmation_token_valid_until: 15.minutes.from_now
    )
    EmailChangeMailer.notify_old_email(user)
  end
end
