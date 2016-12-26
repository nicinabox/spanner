class Vehicle < ApplicationRecord
  validates_presence_of :name

  belongs_to :user
  has_many :reminders, dependent: :destroy
  has_many :records, dependent: :destroy

  ONE_YEAR = 365

  def miles_per_year
    mpd = miles_per_day
    return if mpd.nil? or mpd < 0

    (mpd * ONE_YEAR).to_i
  end

  def miles_per_day
    first = records.order('date ASC').first
    last = records.order('date ASC').last
    return if last.nil? or last.mileage.nil?

    elapsed_days    = (last.date - first.date).to_i / 1.day
    elapsed_mileage = last.mileage - first.mileage
    elapsed_mileage / elapsed_days.to_f
  end
end
