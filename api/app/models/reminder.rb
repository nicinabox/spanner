# frozen_string_literal: true

class Reminder < ApplicationRecord
  validates :notes, presence: true

  belongs_to :vehicle
  belongs_to :service_schedule, optional: true

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
    mpd = vehicle.miles_per_day
    mileage && vehicle.estimated_mileage && mpd&.positive?
  end

  def set_reminder_date!
    self.reminder_date = calculate_reminder_date
  end

  def calculate_reminder_date
    return estimate_date if mileage_reminder?
    return date if date_reminder?

    return unless date_or_mileage_reminder? && can_estimate_date?

    [date, estimate_date].min
  end

  def estimate_date
    return unless can_estimate_date?

    delta = mileage - vehicle.estimated_mileage
    days = delta / vehicle.miles_per_day
    Time.zone.today + days.days
  end
end
