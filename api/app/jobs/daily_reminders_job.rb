class DailyRemindersJob < ApplicationJob
  queue_as :default

  def perform
    upcoming_reminders
  end

  def upcoming_reminders
    reminders = reminders_on(2.weeks.from_now)
    users = reminders.group_by { |r| r.vehicle.user }

    users.each do |user, reminders|
      RemindersMailer.reminder_upcoming(user, reminders).deliver_now
    end
  end

  private

  def reminders_on(date)
    Reminder.where(reminder_date: date.beginning_of_day..date.end_of_day)
  end
end
