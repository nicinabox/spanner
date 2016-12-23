class RemindersMailer < ApplicationMailer
  def reminder(user, reminders)
    @user      = user
    @reminders = reminders

    mail to: @user.email, subject: reminder_subject(reminders)
  end

  private

  def reminder_subject(reminders)
    names = reminders.map { |r| r.vehicle.name }.uniq
    "Reminders for #{names.to_sentence}"
  end
end
