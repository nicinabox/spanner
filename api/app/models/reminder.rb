class Reminder < ApplicationRecord
  validates_presence_of :notes

  belongs_to :vehicle

  before_save :set_estimated_date
  before_update :set_estimated_date

  def mileage_reminder?
    reminder_type == 'mileage'
  end

  def date_reminder?
    reminder_type == 'date'
  end

  def can_estimate_date?
    vehicle.estimated_mileage && vehicle.miles_per_day
  end

  def set_estimated_date
    return if date_reminder?

    if mileage_reminder?
      self.date = estimate_date
    else
      self.date = nil
    end
  end

  def estimate_date
    return unless can_estimate_date?

    days = (mileage - vehicle.estimated_mileage) / vehicle.miles_per_day
    Date.today + days.days
  end
end
