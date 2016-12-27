# Preview all emails at http://localhost:3000/rails/mailers/reminders_mailer
class RemindersMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/reminders_mailer/reminder
  def reminder_today
    user = User.find 40
    reminders = user.reminders

    RemindersMailer.reminder_today(user, reminders)
  end

  def reminder_upcoming
    user = User.find 40
    reminders = user.reminders

    RemindersMailer.reminder_upcoming(user, reminders)
  end

end
