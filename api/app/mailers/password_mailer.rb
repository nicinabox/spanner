# frozen_string_literal: true

class PasswordMailer < ApplicationMailer
  def reset_link(user, web_url: nil)
    @web_url = web_url
    @user = user
    @reset_url = web_reset_password_url(token: user.password_reset_token)
    mail to: @user.email, subject: 'Reset your Spanner password'
  end
end
