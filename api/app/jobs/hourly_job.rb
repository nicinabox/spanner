# frozen_string_literal: true

class HourlyJob < ApplicationJob
  queue_as :low_priority

  def perform
    today_reminders_in_timezone
  end

  def today_reminders_in_timezone
    # rubocop:disable Rails/FindEach
    ActiveSupport::TimeZone.all.each do |tz|
      # rubocop:enable Rails/FindEach
      local_time = Time.zone.now.in_time_zone(tz)
      next unless local_time.hour.zero?

      time_zone_offset = tz.utc_offset / (60 * 60)
      date = local_time.to_date

      User.where(time_zone_offset: time_zone_offset).find_each do |user|
        next unless user.reminder_eligible?

        reminders = user.reminders.where(reminder_date: date.all_day)
        reminders = reminders.select do |r|
          r.vehicle.preferences.send_reminder_emails
        end

        next if reminders.empty?

        RemindersMailer.reminder_today(user, reminders).deliver_now
        user.record_reminder_sent!
      end
    end
  end
end
