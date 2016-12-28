class LoginMailer < ApplicationMailer

  def login_link(user)
    @user = user
    mail to: @user.email, subject: "Sign in to Spanner (#{expires_time})"
  end

  def login_token(user)
    @user = user
    mail to: @user.email, subject: "Sign in to Spanner (#{expires_time})"
  end

  def expires_time
    "expires #{(Time.now + 15.minutes).to_s(:short)}"
  end
end
