# frozen_string_literal: true

require 'test_helper'

class ClassificationTest < ActiveSupport::TestCase
  test 'requires name and keywords' do
    classification = Classification.new(name: nil, keywords: nil)
    assert_not classification.valid?
    assert_includes classification.errors[:name], "can't be blank"
    assert_includes classification.errors[:keywords], "can't be blank"
  end

  test 'requires unique name per vehicle' do
    vehicle = vehicles(:one)
    Classification.create!(name: 'Test', keywords: ['test'], vehicle: vehicle)
    duplicate = Classification.new(name: 'Test', keywords: ['test'], vehicle: vehicle)
    assert_not duplicate.valid?
    assert_includes duplicate.errors[:name], 'has already been taken'
  end

  test 'allows same name on different vehicles' do
    Classification.create!(name: 'Test', keywords: ['test'], vehicle: vehicles(:one))
    other = Classification.new(name: 'Test', keywords: ['test'], vehicle: vehicles(:two))
    assert other.valid?
  end

  test 'requires vehicle' do
    classification = Classification.new(name: 'Test', keywords: ['test'])
    assert_not classification.valid?
    assert_includes classification.errors[:vehicle], 'must exist'
  end
end
