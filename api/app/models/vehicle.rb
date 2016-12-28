class Vehicle < ApplicationRecord
  validates_presence_of :name

  belongs_to :user
  has_many :reminders, dependent: :destroy
  has_many :records, dependent: :destroy

  default_scope { order(position: :asc) }

  ONE_YEAR = 365

  def estimated_mileage
    return unless can_estimate_mpd?

    last_record = last_record_with_mileage
    (last_record.mileage + miles_per_day * elapsed_days(Time.now, last_record.date)).to_i
  end

  def miles_per_year
    return unless can_estimate_mpd?
    (miles_per_day * ONE_YEAR).to_i
  end

  def miles_per_day
    return unless can_estimate_mpd?

    first_record = first_record_with_mileage
    last_record = last_record_with_mileage

    elapsed_mileage = last_record.mileage - first_record.mileage
    elapsed_mileage / elapsed_days(last_record.date, first_record.date)
  end

  def elapsed_days(end_date, start_date)
    ((end_date - start_date).to_i / 1.day).to_f
  end

  def can_estimate_mpd?
    records.any? && first_record_with_mileage != last_record_with_mileage
  end

  def first_record_with_mileage
    @first_record_with_mileage = records.where.not(mileage: nil).first
  end

  def last_record_with_mileage
    @last_record_with_mileage = records.where.not(mileage: nil).last
  end
end
