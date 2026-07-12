# frozen_string_literal: true

class MileageProjection
  RECORD_LIMIT = 10
  ONE_YEAR = 365

  Projection = Data.define(
    :eligible?,
    :estimated_mileage,
    :miles_per_day,
    :miles_per_year,
    :estimated_next_record_date
  )

  def self.estimate(record_pairs, as_of:)
    new(record_pairs, as_of:).estimate
  end

  def initialize(record_pairs, as_of:)
    @pairs = record_pairs
    @as_of = as_of.to_date
  end

  def estimate
    Projection.new(
      eligible?: eligible?,
      estimated_mileage: estimated_mileage,
      miles_per_day: eligible? ? calculated_miles_per_day : nil,
      miles_per_year: miles_per_year_value,
      estimated_next_record_date: estimated_next_record_date
    )
  end

  private

  attr_reader :pairs, :as_of

  def eligible?
    pairs.size >= 2
  end

  def estimated_mileage
    unless eligible?
      return if pairs.empty?

      return pairs.first[1]
    end

    projected = round_to(estimated_mileage_exact, 50)
    return estimated_mileage_exact.round(-1) unless projected > 50

    projected
  end

  def estimated_mileage_exact
    return unless eligible?

    newest = pairs.first
    (newest[1] + (calculated_miles_per_day * elapsed_days(as_of, newest[0]))).to_i
  end

  def estimated_next_record_date
    return unless eligible?

    newest = pairs.first
    days = weighted_average_days_per_period + elapsed_days(as_of, newest[0])
    newest[0] + days.days
  end

  def miles_per_year_value
    return unless eligible?

    projected = round_to(miles_per_year_exact, 500)
    return miles_per_year_exact.round(-2) unless projected.positive?

    projected
  end

  def miles_per_year_exact
    return unless eligible?

    (calculated_miles_per_day * ONE_YEAR).to_i
  end

  def calculated_miles_per_day
    @calculated_miles_per_day ||= begin
      mile_values = periods.pluck(:weighted_miles_per_day)
      weight_values = periods.pluck(:weight)
      weighted_average(mile_values, weight_values)
    end
  end

  def weighted_average_days_per_period
    day_values = periods.map { |p| p[:elapsed_days] * p[:weight] }
    weight_values = periods.pluck(:weight)
    weighted_average(day_values, weight_values)
  end

  def periods
    @periods ||= pairs.each_with_index.filter_map do |pair, i|
      previous = pairs[i + 1]
      next unless previous

      n = pairs.size - i
      weight = n * (n - 1) / 2

      period_elapsed_days = elapsed_days(pair[0], previous[0])
      next if period_elapsed_days < 1

      elapsed_miles = pair[1] - previous[1]

      {
        elapsed_days: period_elapsed_days,
        elapsed_miles:,
        miles_per_day: elapsed_miles / period_elapsed_days,
        weight:,
        weighted_miles_per_day: (elapsed_miles / period_elapsed_days) * weight
      }
    end
  end

  def elapsed_days(end_date, start_date)
    (end_date - start_date).to_f
  end

  def weighted_average(values, weights)
    sum = values.sum.to_f
    total_weight = weights.sum.to_f
    total_weight.nonzero? ? sum / total_weight : 0
  end

  def round_to(value, int)
    (value / int.to_f).round * int
  end
end
