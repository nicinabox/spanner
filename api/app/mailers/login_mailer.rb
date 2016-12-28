class LoginMailer < ApplicationMailer

  def login_link(user)
    @user = user
    mail to: @user.email, subject: "Sign in to Spanner (expires #{expires_time})"
  end

  def login_token(user)
    @user = user
    mail to: @user.email, subject: "Sign in to Spanner (expires #{expires_time})"
  end

  def expires_time
    time = Time.now
    (time.in_time_zone(@user.time_zone) + 15.minutes).to_s(:short)
  end
end
