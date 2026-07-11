# frozen_string_literal: true

require 'test_helper'

class HeuristicClassifierTest < ActiveSupport::TestCase
  setup do
    @vehicle = vehicles(:one)
    @oil = Classification.create!(
      name: 'Oil Change',
      vehicle: @vehicle,
      keywords: ['oil change', 'engine oil', 'motor oil', 'oil filter']
    )
    @air_filter = Classification.create!(
      name: 'Air Filter',
      vehicle: @vehicle,
      keywords: ['air filter', 'engine air filter']
    )
    @cabin_filter = Classification.create!(
      name: 'Cabin Air Filter',
      vehicle: @vehicle,
      keywords: ['cabin air filter', 'cabin filter']
    )
  end

  test 'classifies oil change notes' do
    results = HeuristicClassifier.classify('Change oil and filter', vehicle: @vehicle)
    assert_includes result_names(results), 'Oil Change'
  end

  test 'classifies multiple services in one note' do
    results = HeuristicClassifier.classify('Transmission service and oil change', vehicle: @vehicle)
    assert_includes result_names(results), 'Oil Change'
  end

  test 'returns empty array for unrecognized notes' do
    results = HeuristicClassifier.classify('Washed and vacuumed car', vehicle: @vehicle)
    assert_empty results
  end

  test 'does not create classifications for non-matching notes' do
    before_count = Classification.count
    HeuristicClassifier.classify('Washed and vacuumed car', vehicle: @vehicle)
    assert_equal before_count, Classification.count
  end

  test 'returns empty array for blank notes' do
    results = HeuristicClassifier.classify(nil, vehicle: @vehicle)
    assert_empty results

    results = HeuristicClassifier.classify('   ', vehicle: @vehicle)
    assert_empty results
  end

  test 'returns empty array when classifying without a vehicle' do
    results = HeuristicClassifier.classify('oil change')
    assert_empty results
  end

  test 'each result includes classification, classifier, and confidence' do
    results = HeuristicClassifier.classify('oil change', vehicle: @vehicle)
    assert_equal 1, results.size

    result = results.first
    assert_instance_of Classification, result[:classification]
    assert_equal 'heuristic', result[:classifier]
    assert result[:confidence].is_a?(Float)
    assert result[:confidence].positive?
    assert result[:confidence] <= 1.0
  end

  test 'classify with vehicle-scoped keywords' do
    tag = Classification.create!(
      name: 'Hull Cleaning',
      vehicle: @vehicle,
      keywords: ['hull cleaning', 'clean hull', 'zincs']
    )
    results = HeuristicClassifier.classify('Cleaned the hull and replaced zincs', vehicle: @vehicle)
    assert_includes results.map { |r| r[:classification].id }, tag.id
  end

  test 'matches by keywords not name' do
    Classification.create!(
      name: 'Custom Service',
      vehicle: @vehicle,
      keywords: ['oil change']
    )
    results = HeuristicClassifier.classify('oil change', vehicle: @vehicle)
    names = result_names(results)
    assert_includes names, 'Custom Service'
  end

  test 'classifies multiple matching services' do
    results = HeuristicClassifier.classify('oil change and air filter', vehicle: @vehicle)
    names = result_names(results)
    assert_includes names, 'Oil Change'
    assert_includes names, 'Air Filter'
  end

  test 'classifies cabin air filter' do
    results = HeuristicClassifier.classify('cabin air filter', vehicle: @vehicle)
    assert_includes result_names(results), 'Cabin Air Filter'
  end

  test 'classifies comma-separated services' do
    results = HeuristicClassifier.classify('Oil change, Air Filter, Cabin Air Filter', vehicle: @vehicle)
    names = result_names(results)
    assert_includes names, 'Oil Change'
    assert_includes names, 'Air Filter'
    assert_includes names, 'Cabin Air Filter'
  end

  test 'does not return classifications whose keywords do not match' do
    results = HeuristicClassifier.classify('oil change', vehicle: @vehicle)
    assert_not_includes result_names(results), 'Air Filter'
  end

  test 'confidence is at least 0.25 for matching keywords' do
    results = HeuristicClassifier.classify('oil change', vehicle: @vehicle)
    oil = results.find { |r| r[:classification].name == 'Oil Change' }
    assert_not_nil oil
    assert oil[:confidence] >= 0.25, "expected >=0.25, got #{oil[:confidence]}"
  end

  private

  def result_names(results)
    results.map { |r| r[:classification].name }.sort
  end
end
