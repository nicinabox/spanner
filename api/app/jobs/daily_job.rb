# frozen_string_literal: true

class DailyJob < ApplicationJob
  queue_as :low_priority

  def perform
    upcoming_reminders
    upcoming_schedules
    delete_expired_sessions
    cleanup_unverified_accounts
    purge_deleted_accounts
  end

  def purge_deleted_accounts
    PurgeDeletedAccountsJob.perform_later
  end

  def cleanup_unverified_accounts
    CleanupUnverifiedAccountsJob.perform_later
  end

  def upcoming_reminders
    reminders = reminders_on(2.weeks.from_now)
    users = reminders.group_by { |r| r.vehicle.user }

    users.each do |user, user_reminders|
      next unless user.reminder_eligible?

      user_reminders.each do |r|
        Rails.logger.info do
          "[DailyJob] Sending reminder #{r.id} for vehicle #{r.vehicle_id} " \
            "(send_reminder_emails=#{r.vehicle.preferences.send_reminder_emails})"
        end
      end

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
    Rails.logger.info do
      "[DailyJob] reminders_on(#{date}): found #{reminders.size} raw reminders"
    end
    filtered = reminders.select do |r|
      prefs = r.vehicle.preferences
      allowed = prefs.send_reminder_emails
      Rails.logger.info do
        "[DailyJob] reminder #{r.id} (vehicle #{r.vehicle_id}): " \
          "send_reminder_emails=#{allowed.inspect} " \
          "raw_prefs=#{r.vehicle.read_attribute(:preferences).inspect}"
      end
      allowed
    end
    Rails.logger.info do
      "[DailyJob] reminders_on: #{filtered.size} after filter"
    end
    filtered
  end
end
