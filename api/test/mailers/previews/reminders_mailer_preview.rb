# Preview all emails at http://localhost:3000/rails/mailers/reminders_mailer
class RemindersMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/reminders_mailer/reminder
  def reminder
    user = User.find 40
    reminders = user.reminders

    RemindersMailer.reminder(user, reminders)
  end

end
