# Preview all emails at http://localhost:3000/rails/mailers/login_mailer
class LoginMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/login_mailer/login_link
  def login_link
    user = User.first
    LoginMailer.login_link(user)
  end

end
