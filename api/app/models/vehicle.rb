class Vehicle < ApplicationRecord
  validates_presence_of :name

  belongs_to :user
  has_many :reminders, dependent: :destroy
  has_many :records, dependent: :destroy

  default_scope { order(position: :asc, id: :asc) }

  ONE_YEAR = 365
  WEIGHT_COEFFICIENT = 10

  def mean_days_between_records
    span_secs = records.maximum(:date) - records.minimum(:date)
    days = span_secs / (records.count - 1) / (24 * 60 * 60)
    days.round
  end

  def squish_vin
    return unless vin? && vin.size > 10
    vin[0..7] + vin[9..10]
  end

  def estimated_mileage
    return unless can_estimate_mpd?

    last_record = last_record_with_mileage
    (last_record.mileage + weighted_miles_per_day * elapsed_days(Time.now, last_record.date)).to_i
  end

  def miles_per_year
    return unless can_estimate_mpd?
    (weighted_miles_per_day * ONE_YEAR).to_i
  end

  def periods
    @periods ||= begin
      selected = records
        .unscope(:order)
        .where('mileage > 0')
        .limit(WEIGHT_COEFFICIENT)
        .order('date DESC')
        .pluck(:date, :mileage)

      results = selected.each_with_index.map do |r, i|
        previous = selected[i + 1]
        next if !previous

        n = WEIGHT_COEFFICIENT - i
        weight = n * (n - 1) / 2

        period_elapsed_days = elapsed_days(r[0], previous[0])
        next if period_elapsed_days < 1

        elapsed_miles = r[1] - previous[1]

        {
          elapsed_days: period_elapsed_days,
          elapsed_miles: elapsed_miles,
          miles_per_day: elapsed_miles / period_elapsed_days,
          weight: weight,
          weighted_miles_per_day: (elapsed_miles / period_elapsed_days) * weight,
        }
      end.compact

      results
    end
  end

  def miles_per_day
    weighted_miles_per_day
  end

  def weighted_miles_per_day
    miles = periods.map { |p| p[:weighted_miles_per_day] }
    weights = periods.map { |p| p[:weight] }

    weighted_average(miles, weights)
  end

  def average_miles_per_day
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
    @first_record_with_mileage ||= records.where('mileage > 0').first
  end

  def last_record_with_mileage
    @last_record_with_mileage ||= records.where('mileage > 0').last
  end

  private
  def weighted_average(values, weights)
    sum = values.inject(:+).to_f
    total_weight = weights.inject(:+).to_f

    sum / total_weight
  end
end
