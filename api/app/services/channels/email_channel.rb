# frozen_string_literal: true

class EmailChannel < Channel
  def deliver(event, user:, reminders: nil, schedules: nil)
    case event
    when :reminder_today
      RemindersMailer.reminder_today(user, reminders).deliver_now
    when :reminder_upcoming
      RemindersMailer.reminder_upcoming(user, reminders).deliver_now
    when :schedule_due_today
      RemindersMailer.reminder_today(user, schedules_as_reminders(schedules)).deliver_now
    when :schedule_due_upcoming
      RemindersMailer.reminder_upcoming(user, schedules_as_reminders(schedules)).deliver_now
    end
  end

  private

  def available?
    ENV['POSTMARK_API_KEY'].present? || ENV['SMTP_HOST'].present?
  end

  def schedules_as_reminders(schedules)
    schedules.map { |s| ScheduleReminderAdapter.new(s) }
  end
end
