# Preview all emails at http://localhost:3000/rails/mailers/prompt_user_mailer
class PromptUserMailerPreview < ActionMailer::Preview
  def add_record
    user = User.first
    vehicle = user.vehicles.first

    PromptUserMailer.add_record(user, vehicle)
  end
end
