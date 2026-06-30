# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/password_mailer
class PasswordMailerPreview < ActionMailer::Preview
  # Preview this email at http://localhost:3000/rails/mailers/password_mailer/reset_link
  def reset_link
    user = User.first
    user ||= User.create!(email: 'preview@example.com', password: 'password123')
    user.update!(password: 'password123') unless user.password_enabled?
    PasswordMailer.reset_link(user)
  end
end
