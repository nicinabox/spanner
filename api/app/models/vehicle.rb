class Vehicle < ApplicationRecord
  validates_presence_of :name

  belongs_to :user
  has_many :reminders, dependent: :destroy
  has_many :records, dependent: :destroy

  default_scope { order(position: :asc, id: :asc) }

  ONE_YEAR = 365
  WEIGHT_COEFFICIENT = 10

  def prompt_for_first_record!
    return if records.any?

    PromptUserMailer.add_first_record(user, self).deliver_later
    GoodJob.set(wait: 3.days).perform_later(self, 'prompt_for_first_record!')
  end

  def prompt_for_new_record!
    date = estimated_next_record_date
    return unless date and date <= Date.today.beginning_of_day

    PromptUserMailer.add_record(user, self).deliver_later
  end

  def squish_vin
    return unless vin? && vin.size > 10
    vin[0..7] + vin[9..10]
  end

  def estimated_mileage
    return unless can_estimate_mpd?

    last_record = last_record_with_mileage
    (last_record.mileage + weighted_averge_miles_per_day * elapsed_days(Time.now, last_record.date)).to_i
  end

  def estimated_next_record_date
    record = last_record_with_mileage
    return unless record

    days = weighted_average_days_per_period + elapsed_days(Time.now, record.date)
    record.date + days.days
  end

  def miles_per_year
    return unless can_estimate_mpd?
    (weighted_averge_miles_per_day * ONE_YEAR).to_i
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

        n = selected.size - i
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
    weighted_averge_miles_per_day
  end

  def weighted_average_days_per_period
    days = periods.map { |p| p[:elapsed_days] * p[:weight] }
    weights = periods.map { |p| p[:weight] }

    weighted_average(days, weights)
  end

  def weighted_averge_miles_per_day
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

    total_weight.nonzero? ? sum / total_weight : 0
  end
end
