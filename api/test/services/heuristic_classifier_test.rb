# frozen_string_literal: true

require 'test_helper'

class HeuristicClassifierTest < ActiveSupport::TestCase
  test 'classifies oil change notes' do
    results = HeuristicClassifier.classify('Change oil and filter')
    assert_equal ['Oil Change'], result_names(results)
  end

  test 'classifies multiple services in one note' do
    results = HeuristicClassifier.classify('Transmission service and oil change')
    assert_equal ['Oil Change', 'Transmission'], result_names(results)
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

  private

  def result_names(results)
    results.map { |r| r[:classification].name }.sort
  end
end
