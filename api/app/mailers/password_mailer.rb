# frozen_string_literal: true

class PasswordMailer < ApplicationMailer
  def reset_link(user)
    @user = user
    @reset_url = "#{frontend_base_url}/reset-password/#{user.password_reset_token}"
    mail to: @user.email, subject: 'Reset your Spanner password'
  end

  private

  def frontend_base_url
    ENV.fetch('WEB_URL', ActionMailer::Base.default_url_options[:host].to_s.chomp('/'))
  end
end
