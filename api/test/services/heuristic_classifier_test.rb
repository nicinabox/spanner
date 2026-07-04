# frozen_string_literal: true

require 'test_helper'

class HeuristicClassifierTest < ActiveSupport::TestCase
  test 'classifies oil change notes' do
    results = HeuristicClassifier.classify('Change oil and filter')
    assert_equal ['Oil Change'], result_names(results)
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
    assert_equal 1.0, result[:confidence]
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

  private

  def result_names(results)
    results.map { |r| r[:classification].name }.sort
  end
end
