# frozen_string_literal: true

require 'test_helper'

class RecordClassificationTest < ActiveSupport::TestCase
  setup do
    @vehicle = Vehicle.first || Vehicle.create!(name: 'Test Vehicle', user: User.first)
    @classification = Classification.create!(
      name: 'Test Classification',
      vehicle: @vehicle,
      keywords: ['test'],
      system: false
    )

    # Create vehicle-specific classifications with keywords and service schedules
    {
      'Oil Change' => ['oil change', 'engine oil', 'motor oil', 'oil filter'],
      'Tire Rotation' => ['tire rotation', 'rotate tires', 'rotate tyres'],
      'Battery' => ['new battery', 'replace battery', 'battery replacement']
    }.each do |name, keywords|
      c = Classification.create!(
        name: name,
        vehicle: @vehicle,
        keywords: keywords,
        system: false
      )
      @vehicle.service_schedules.find_or_create_by!(classification: c) do |s|
        s.distance_interval = 5000
      end
    end
  end

  test 'creating a record classifies notes' do
    record = @vehicle.records.create!(date: Time.zone.today, notes: 'Changed oil and rotated tires')
    names = record.classifications.pluck(:name).sort
    assert_includes names, 'Oil Change'
    assert_includes names, 'Tire Rotation'
  end

  test 'updating record notes adds new classifications without removing existing' do
    record = @vehicle.records.create!(date: Time.zone.today, notes: 'Changed oil')
    assert_includes record.classifications.pluck(:name), 'Oil Change'

    record.update!(notes: 'New battery')
    assert_includes record.classifications.pluck(:name), 'Battery'
    assert_includes record.classifications.pluck(:name), 'Oil Change'
  end

  test 'record classification requires classifier' do
    record = @vehicle.records.create!(date: Time.zone.today, notes: 'Test')
    rc = RecordClassification.new(record: record, classification: @classification)
    assert_not rc.valid?
    assert_includes rc.errors[:classifier], "can't be blank"
  end

  test 'record classification confidence defaults to 1.0' do
    record = @vehicle.records.create!(date: Time.zone.today, notes: 'Test')
    rc = RecordClassification.new(record: record, classification: @classification, classifier: 'heuristic')
    assert rc.valid?
    assert_equal 1.0, rc.confidence
  end
end
