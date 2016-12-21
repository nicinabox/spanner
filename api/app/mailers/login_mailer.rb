class LoginMailer < ApplicationMailer

  def login_link(user)
    @user = user
    mail to: @user.email, subject: 'Sign in to Spanner'
  end

  def login_token(user)
    @user = user
    mail to: @user.email, subject: 'Sign in to Spanner'
  end
end
