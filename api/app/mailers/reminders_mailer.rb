class RemindersMailer < ApplicationMailer
  def reminder_today(user, reminders)
    @user      = user
    @reminders = reminders

    mail to: @user.email, subject: reminder_subject(reminders)
  end

  def reminder_upcoming(user, reminders)
    @user      = user
    @reminders = reminders
    @date      = @reminders.first.try(:reminder_date) || @reminders.first.try(:date) || Date.today

    mail to: @user.email, subject: reminder_subject(reminders)
  end

  private

  def reminder_subject(reminders)
    names = reminders.map { |r| r.vehicle.name }.uniq
    "Reminders for #{names.to_sentence}"
  end
end
