class Vehicle < ApplicationRecord
  validates_presence_of :name

  belongs_to :user
  has_many :reminders, dependent: :destroy
  has_many :records, dependent: :destroy

  ONE_YEAR = 365

  def estimated_mileage
    return unless can_estimate_mpd?

    last_record = records.last

    elapsed_days = (Time.now - last_record.date).to_i / 1.day
    (last_record.mileage + miles_per_day * elapsed_days).to_i
  end

  def miles_per_year
    return unless can_estimate_mpd?
    (miles_per_day * ONE_YEAR).to_i
  end

  def miles_per_day
    return unless can_estimate_mpd?

    first = records.first
    last = records.last

    elapsed_days    = (last.date - first.date).to_i / 1.day
    elapsed_mileage = last.mileage - first.mileage
    elapsed_mileage / elapsed_days.to_f
  end

  def can_estimate_mpd?
    first = records.first
    last = records.last

    !(last.nil? or last.mileage.nil?)
  end
end
