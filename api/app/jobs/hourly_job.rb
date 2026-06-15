# frozen_string_literal: true

class HourlyJob < ApplicationJob
  queue_as :low_priority

  def perform
    today_reminders_in_timezone
  end

  def today_reminders_in_timezone
    tz = find_midnight_timezone
    return unless tz

    send_reminders_for_timezone(tz)
  end

  private

  def find_midnight_timezone
    ActiveSupport::TimeZone.all.find { |tz| Time.now.in_time_zone(tz).hour.zero? }
  end

  def send_reminders_for_timezone(time_zone)
    time_zone_offset = time_zone.utc_offset / (60 * 60)
    date = Time.now.in_time_zone(time_zone)
    users = User.where time_zone_offset: time_zone_offset

    users.each do |user|
      next unless user.reminder_eligible?

      reminders = eligible_reminders(user, date)
      next if reminders.empty?

      RemindersMailer.reminder_today(user, reminders).deliver_now
      user.record_reminder_sent!
    end
  end

  def eligible_reminders(user, date)
    reminders = user.reminders.where(reminder_date: date.all_day)
    reminders.select do |r|
      r.vehicle.preferences.send_reminder_emails
    end
  end
end
