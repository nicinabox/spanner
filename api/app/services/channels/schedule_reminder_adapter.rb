# frozen_string_literal: true

# Adapts a ServiceSchedule to present the same interface as a Reminder
# so existing mailer templates work unchanged.
class ScheduleReminderAdapter
  delegate :vehicle, to: :@schedule

  def initialize(schedule)
    @schedule = schedule
  end

  def notes
    @schedule.notes.presence || @schedule.classification.name
  end

  def reminder_date
    @schedule.next_due_date
  end

  def mileage
    @schedule.next_due_mileage
  end

  def date
    @schedule.next_due_date
  end
end
