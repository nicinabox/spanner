class LoginMailer < ApplicationMailer

  def login_link(user)
    @user = user
    mail to: @user.email, subject: subject
  end

  def login_token(user)
    @user = user
    mail to: @user.email, subject: subject
  end

  private
  def subject
    "Sign in to Spanner (expires #{expires_time})"
  end

  def expires_time
    now = Time.now.in_time_zone @user.time_zone
    time = now + 15.minutes
    time.to_s(:short)
  end
end
