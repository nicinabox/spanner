# frozen_string_literal: true

require 'test_helper'

class ClassificationTest < ActiveSupport::TestCase
  test 'requires key and name' do
    classification = Classification.new(key: nil, name: nil)
    assert_not classification.valid?
    assert_includes classification.errors[:key], "can't be blank"
    assert_includes classification.errors[:name], "can't be blank"
  end

  test 'requires unique key' do
    Classification.create!(key: 'test_key', name: 'Test')
    duplicate = Classification.new(key: 'test_key', name: 'Other')
    assert_not duplicate.valid?
    assert_includes duplicate.errors[:key], 'has already been taken'
  end

  test 'validates key format' do
    classification = Classification.new(key: 'Invalid Key', name: 'Test')
    assert_not classification.valid?
    assert_includes classification.errors[:key], 'is invalid'
  end

  test 'system scope returns only system classifications' do
    system_count = Classification.system.count
    assert system_count.positive?

    Classification.create!(key: 'custom', name: 'Custom', system: false)
    assert_equal system_count, Classification.system.count
  end
end
