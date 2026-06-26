# frozen_string_literal: true

class HourlyJob < ApplicationJob
  queue_as :low_priority

  def perform
    today_reminders_in_timezone
  end

  def today_reminders_in_timezone
    # Iterate the offsets users have actually stored, not all `ActiveSupport::TimeZone.all`
    # entries. Many timezones share the same integer offset (e.g. UTC, Edinburgh,
    # Lisbon, London, Monrovia all at 0h), so iterating them all would dispatch
    # the same user multiple times per run. Using the stored offset also matches
    # what the client sends (current offset including DST).
    User.distinct.pluck(:time_zone_offset).each do |stored_offset|
      next if stored_offset.blank?

      offset_hours = stored_offset.to_f
      local_time = Time.zone.now + offset_hours.hours
      next unless local_time.hour.zero?

      date = local_time.to_date

      User.where(time_zone_offset: stored_offset).find_each do |user|
        next unless user.reminder_eligible?

        dispatch_manual_reminders(user, date)
        dispatch_due_schedules(user, date)
      end
    end
  end

  private

  def dispatch_manual_reminders(user, date)
    reminders = user.reminders.where(reminder_date: date.all_day)
    reminders = reminders.select { |r| r.vehicle.preferences.send_reminder_emails }
    return if reminders.empty?

    NotificationDispatcher.dispatch(:reminder_today, user: user, reminders: reminders)
    user.record_reminder_sent!
  end

  def dispatch_due_schedules(user, date)
    schedules = ServiceSchedule.joins(:vehicle)
                               .where(vehicles: { user_id: user.id })
                               .where(next_due_date: date.all_day, enabled: true)
                               .includes(:vehicle, :classification)
    return if schedules.empty?

    NotificationDispatcher.dispatch(:schedule_due_today, user: user, schedules: schedules)
  end
end
