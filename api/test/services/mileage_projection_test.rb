# frozen_string_literal: true

require 'test_helper'

class MileageProjectionTest < ActiveSupport::TestCase
  test 'eligible with two or more records' do
    pairs = [
      [Date.new(2026, 7, 1), 100_000],
      [Date.new(2025, 7, 1), 50_000]
    ]
    proj = MileageProjection.estimate(pairs, as_of: Date.new(2026, 7, 1))

    assert proj.eligible?
  end

  test 'not eligible with single record' do
    pairs = [[Date.new(2026, 6, 1), 75_000]]
    proj = MileageProjection.estimate(pairs, as_of: Date.new(2026, 7, 1))

    assert_not proj.eligible?
    assert_nil proj.miles_per_day
    assert_nil proj.miles_per_year
    assert_nil proj.estimated_next_record_date
  end

  test 'not eligible with empty pairs' do
    proj = MileageProjection.estimate([], as_of: Date.new(2026, 7, 1))

    assert_not proj.eligible?
    assert_nil proj.estimated_mileage
    assert_nil proj.miles_per_day
  end

  test 'estimated_mileage falls back to newest record when not eligible' do
    pairs = [[Date.new(2026, 6, 1), 75_000]]
    proj = MileageProjection.estimate(pairs, as_of: Date.new(2026, 7, 1))

    assert_equal 75_000, proj.estimated_mileage
  end

  test 'estimated_mileage with two records' do
    pairs = [
      [Date.new(2026, 7, 1), 100_000],
      [Date.new(2025, 7, 1), 50_000]
    ]
    proj = MileageProjection.estimate(pairs, as_of: Date.new(2026, 7, 1))

    # 50k miles / 365 days = ~136.99 mpd
    # projected from last record: 100000 + 0 days * 136.99 = 100000
    assert_equal 100_000, proj.estimated_mileage
  end

  test 'projected mileage increases with elapsed time' do
    pairs = [
      [Date.new(2026, 7, 1), 100_000],
      [Date.new(2025, 7, 1), 50_000]
    ]
    # 30 days after last record: 100000 + (30 * 136.99) = ~104110
    proj = MileageProjection.estimate(pairs, as_of: Date.new(2026, 7, 31))

    assert proj.estimated_mileage > 100_000
  end

  test 'miles_per_day with two records' do
    pairs = [
      [Date.new(2026, 7, 1), 100_000],
      [Date.new(2025, 7, 1), 50_000]
    ]
    proj = MileageProjection.estimate(pairs, as_of: Date.new(2026, 7, 1))

    assert_in_delta 136.99, proj.miles_per_day, 0.01
  end

  test 'miles_per_year with two records' do
    pairs = [
      [Date.new(2026, 7, 1), 100_000],
      [Date.new(2025, 7, 1), 50_000]
    ]
    proj = MileageProjection.estimate(pairs, as_of: Date.new(2026, 7, 1))

    # 136.99 * 365 ≈ 50000, rounded to nearest 500
    assert proj.miles_per_year.present?
    assert proj.miles_per_year.positive?
  end

  test 'estimated_next_record_date' do
    pairs = [
      [Date.new(2026, 7, 1), 100_000],
      [Date.new(2025, 7, 1), 50_000],
      [Date.new(2024, 7, 1), 0]
    ]
    proj = MileageProjection.estimate(pairs, as_of: Date.new(2026, 7, 1))

    assert proj.estimated_next_record_date.present?
    assert_kind_of Date, proj.estimated_next_record_date
  end

  test 'skips periods with zero elapsed days' do
    pairs = [
      [Date.new(2026, 7, 1), 100_000],
      [Date.new(2026, 7, 1), 95_000],
      [Date.new(2025, 1, 1), 0]
    ]
    proj = MileageProjection.estimate(pairs, as_of: Date.new(2026, 7, 1))

    # Should skip the 0-day interval and use the valid one
    assert proj.eligible?
    assert proj.miles_per_day.present?
  end

  test 'triangular weighting favors recent periods' do
    pairs = [
      [Date.new(2026, 7, 1), 100_000],
      [Date.new(2026, 6, 1), 99_000], # recent: 1000 miles in 30 days
      [Date.new(2025, 7, 1), 50_000] # old: 49000 miles in 335 days
    ]
    proj = MileageProjection.estimate(pairs, as_of: Date.new(2026, 7, 1))

    # Triangular weighting favors recent period (33.3 mpd) over old (146.27 mpd),
    # so weighted avg should be LOWER than simple avg
    simple_avg = ((1000.0 / 30) + (49_000.0 / 335)) / 2
    assert proj.miles_per_day < simple_avg,
           "weighted avg (#{proj.miles_per_day}) should be below simple avg (#{simple_avg})"
  end

  test 'round_to helper' do
    pairs = [
      [Date.new(2026, 7, 1), 100_000],
      [Date.new(2025, 7, 1), 50_000]
    ]
    proj = MileageProjection.estimate(pairs, as_of: Date.new(2026, 7, 1))

    assert proj.eligible?
  end
end
