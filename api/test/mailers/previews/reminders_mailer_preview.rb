# Preview all emails at http://localhost:3000/rails/mailers/reminders_mailer
class RemindersMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/reminders_mailer/reminder
  def reminder_today
    user = User.first
    reminders = user.reminders

    RemindersMailer.reminder_today(user, reminders)
  end

  def reminder_upcoming
    user = User.first
    reminders = user.reminders

    RemindersMailer.reminder_upcoming(user, reminders)
  end

  private

  def random_user
    User.offset(rand(User.count)).first
  end

end
