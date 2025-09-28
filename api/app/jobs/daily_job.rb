# frozen_string_literal: true

class DailyJob < ApplicationJob
  queue_as :low_priority

  def perform
    upcoming_reminders
    delete_expired_sessions
  end

  def upcoming_reminders
    reminders = reminders_on(2.weeks.from_now)
    users = reminders.group_by { |r| r.vehicle.user }

    users.each do |user, reminders|
      RemindersMailer.reminder_upcoming(user, reminders).deliver_now
    end
  end

  def delete_expired_sessions
    Session.expired.delete_all
  end

  private

  def reminders_on(date)
    reminders = Reminder.where(reminder_date: date.all_day)
    reminders.select do |r|
      r.vehicle.preferences.send_reminder_emails
    end
  end
end
