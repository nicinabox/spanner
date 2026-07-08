# frozen_string_literal: true

require 'test_helper'

class HeuristicClassifierTest < ActiveSupport::TestCase
  test 'classifies oil change notes' do
    results = HeuristicClassifier.classify('Change oil and filter')
    assert_includes result_names(results), 'Oil Change'
  end

  test 'classifies multiple services in one note' do
    results = HeuristicClassifier.classify('Transmission service and oil change')
    assert_equal ['Oil Change', 'Transmission Fluid'], result_names(results)
  end

  test 'returns empty array for unrecognized notes' do
    results = HeuristicClassifier.classify('Washed and vacuumed car')
    assert_empty results
  end

  test 'returns empty array for blank notes' do
    results = HeuristicClassifier.classify(nil)
    assert_empty results

    results = HeuristicClassifier.classify('   ')
    assert_empty results
  end

  test 'each result includes classification, classifier, and confidence' do
    results = HeuristicClassifier.classify('New battery')
    assert_equal 1, results.size

    result = results.first
    assert_instance_of Classification, result[:classification]
    assert_equal 'heuristic', result[:classifier]
    assert result[:confidence].is_a?(Float)
    assert result[:confidence].positive?
    assert result[:confidence] <= 1.0
  end

  test 'classify with vehicle-scoped keywords' do
    vehicle = vehicles(:one)
    tag = Classification.create!(
      name: 'Hull Cleaning',
      vehicle: vehicle,
      keywords: ['hull cleaning', 'clean hull', 'zincs'],
      system: false
    )
    results = HeuristicClassifier.classify('Cleaned the hull and replaced zincs', vehicle:)
    assert_includes results.map { |r| r[:classification].id }, tag.id
  end

  test 'vehicle-scoped tag overrides system tag with same name' do
    vehicle = vehicles(:one)
    oil_change = Classification.find_by!(key: 'oil_change')
    user_tag = Classification.create!(
      name: 'Oil Change',
      vehicle: vehicle,
      keywords: ['lube service'],
      system: false
    )
    results = HeuristicClassifier.classify('lube service done', vehicle:)
    assert_includes results.map { |r| r[:classification].id }, user_tag.id
    assert_not_includes results.map { |r| r[:classification].id }, oil_change.id
  end

  test 'classify without vehicle uses system keywords only' do
    results = HeuristicClassifier.classify('oil change')
    assert_includes results.map { |r| r[:classification].key }, 'oil_change'
  end

  test 'context words boost confidence for oil change' do
    results = HeuristicClassifier.classify('changed engine oil')
    oil = results.find { |r| r[:classification].key == 'oil_change' }
    assert_not_nil oil
    assert oil[:confidence] > 0.5, "expected >0.5, got #{oil[:confidence]}"
  end

  test 'transmission context boosts transmission over oil change' do
    results = HeuristicClassifier.classify('transmission oil change')
    trans = results.find { |r| r[:classification].name == 'Transmission Fluid' }
    oil = results.find { |r| r[:classification].key == 'oil_change' }
    assert_not_nil trans
    assert_not_nil oil
    assert trans[:confidence] > oil[:confidence],
           "expected transmission (#{trans[:confidence]}) > oil (#{oil[:confidence]})"
  end

  test 'context-free oil change still matches' do
    results = HeuristicClassifier.classify('oil change')
    oil = results.find { |r| r[:classification].key == 'oil_change' }
    assert_not_nil oil
    assert oil[:confidence].positive?
  end

  test 'deduplicates same classification from preset and vehicle' do
    vehicle = vehicles(:one)
    Classification.create!(
      name: 'Oil Change',
      vehicle: vehicle,
      keywords: ['oil change'],
      system: false
    )
    results = HeuristicClassifier.classify('oil change', vehicle:)
    ids = results.map { |r| r[:classification].id }
    assert_equal ids.uniq, ids
  end

  test 'transmission oil change does not get oil change tag' do
    results = HeuristicClassifier.classify('transmission oil change')
    oil = results.find { |r| r[:classification].key == 'oil_change' }
    assert_not_nil oil, 'Oil Change should still match but with low confidence'
    assert oil[:confidence] < 0.25, "expected <0.25, got #{oil[:confidence]}"
  end

  test 'oil change alone gets tagged' do
    results = HeuristicClassifier.classify('oil change')
    oil = results.find { |r| r[:classification].key == 'oil_change' }
    assert_not_nil oil
    assert oil[:confidence] >= 0.25, "expected >=0.25, got #{oil[:confidence]}"
  end

  test 'classifies wiper blades' do
    results = HeuristicClassifier.classify('wipers')
    assert_includes result_names(results), 'Wiper Blades'

    results = HeuristicClassifier.classify('replace wipers')
    assert_includes result_names(results), 'Wiper Blades'

    results = HeuristicClassifier.classify('new windshield wipers')
    assert_includes result_names(results), 'Wiper Blades'
  end

  private

  def result_names(results)
    results.map { |r| r[:classification].name }.sort
  end
end
