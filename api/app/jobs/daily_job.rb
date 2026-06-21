# frozen_string_literal: true

class DailyJob < ApplicationJob
  queue_as :low_priority

  def perform
    upcoming_reminders
    upcoming_schedules
    delete_expired_sessions
    cleanup_unverified_accounts
  end

  def cleanup_unverified_accounts
    CleanupUnverifiedAccountsJob.perform_later
  end

  def upcoming_reminders
    reminders = reminders_on(2.weeks.from_now)
    users = reminders.group_by { |r| r.vehicle.user }

    users.each do |user, user_reminders|
      next unless user.reminder_eligible?

      NotificationDispatcher.dispatch(:reminder_upcoming, user: user, reminders: user_reminders)
      user.record_reminder_sent!
    end
  end

  def upcoming_schedules
    schedules = ServiceSchedule.where(
      next_due_date: Time.zone.today..2.weeks.from_now,
      enabled: true
    ).includes(:vehicle, :classification)

    by_user = schedules.group_by { |s| s.vehicle.user }

    by_user.each do |user, user_schedules|
      next unless user.reminder_eligible?

      NotificationDispatcher.dispatch(:schedule_due_upcoming, user: user, schedules: user_schedules)
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
