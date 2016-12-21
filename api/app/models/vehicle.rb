class Vehicle < ApplicationRecord
  validates_presence_of :name

  belongs_to :user
  has_many :reminders, dependent: :destroy
  has_many :records, dependent: :destroy

  ONE_YEAR = 365

  def miles_per_year
    mpd = miles_per_day
    return if mpd.nil? or mpd < 0

    first = records.order('date ASC').limit(1).first
    elapsed_days = (Time.now - first.date).to_i / 1.day

    if elapsed_days < ONE_YEAR
      remaining_days = ONE_YEAR - Date.today.yday
      mpy = mpd * (elapsed_days + remaining_days)
    else
      mpy = mpd * ONE_YEAR
    end

    (mpy / 10).floor * 10
  end

  def miles_per_day
    first = records.first
    last  = records.last
    return if last.nil? or last.mileage.nil?

    elapsed_days    = (last.date - first.date).to_i / 1.day
    elapsed_mileage = last.mileage - first.mileage
    elapsed_mileage / elapsed_days
  end
end
