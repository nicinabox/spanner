class Reminder < ApplicationRecord
  validates_presence_of :notes

  belongs_to :vehicle

  default_scope { order(date: :asc) }

  before_save :set_reminder_date!
  before_update :set_reminder_date!

  def mileage_reminder?
    reminder_type == 'mileage'
  end

  def date_reminder?
    reminder_type == 'date'
  end

  def date_or_mileage_reminder?
    reminder_type == 'date_or_mileage'
  end

  def can_estimate_date?
    mileage && vehicle.estimated_mileage && vehicle.miles_per_day
  end

  def set_reminder_date!
    if mileage_reminder?
      self.reminder_date = estimate_date
    end

    if date_reminder?
      self.reminder_date = date
    end

    if date_or_mileage_reminder? and can_estimate_date?
      reminder_date = date < estimate_date ? date : estimate_date
      self.reminder_date = reminder_date
    end
  end

  def estimate_date
    return unless can_estimate_date?

    days = (mileage - vehicle.estimated_mileage) / vehicle.miles_per_day
    Date.today + days.days
  end
end
