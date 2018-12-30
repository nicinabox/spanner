class HourlyRemindersJob < ApplicationJob
  queue_as :default

  def perform
    today_reminders_in_timezone
  end

  def today_reminders_in_timezone
    tz = ActiveSupport::TimeZone.all.find {|tz| Time.now.in_time_zone(tz).hour === 0 }
    time_zone_offset = tz.utc_offset / (60 * 60)
    date = Time.now.in_time_zone(tz)
    users = User.where time_zone_offset: time_zone_offset

    users.each do |user|
      reminders = user.reminders.where(reminder_date: date.beginning_of_day..date.end_of_day)

      if reminders.any?
        RemindersMailer.reminder_today(user, reminders).deliver_now
      end
    end
  end
end
