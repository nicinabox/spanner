# frozen_string_literal: true

require 'test_helper'

class RecordTest < ActiveSupport::TestCase
  test 'classify_notes on save' do
    vehicle = Vehicle.first || Vehicle.create!(name: 'Test Vehicle', user: User.first)

    # Ensure Oil Change has a service schedule so auto-tagging works
    oil_class = Classification.find_by(key: 'oil_change')
    if oil_class && !vehicle.service_schedules.exists?(classification_id: oil_class.id)
      vehicle.service_schedules.create!(
        classification: oil_class,
        distance_interval: 5000
      )
    end

    oil_changes = [
      'Changed oil with Mobil 1 5w-30 and new MANN filter',
      'Oil change with Castrol 5w30 and changed oil filter using bosch unit',
      'Change oil (5W30SYN), filter (R84712). '
    ]

    not_oil_changes = [
      'Replaced windshield wipers',
      'Washed and vacuumed car'
    ]

    records = [*oil_changes, *not_oil_changes].map do |notes|
      vehicle.records.create!(date: Time.zone.today, notes: notes)
    end

    records.each do |record|
      is_oil_change = record.classifications.exists?(key: 'oil_change')

      if oil_changes.include? record.notes
        assert is_oil_change, record.notes
      else
        assert_not is_oil_change, record.notes
      end
    end
  end

  test 'has many attached attachments' do
    vehicle = begin
      vehicles(:one)
    rescue StandardError
      Vehicle.first || Vehicle.create!(name: 'Test Vehicle', user: User.first)
    end
    record = vehicle.records.create!(date: Time.zone.today, notes: 'Oil change')

    assert record.respond_to?(:attachments)
    assert record.attachments.respond_to?(:attach)

    file = file_fixture('receipt.pdf')
    record.attachments.attach(io: file.open, filename: 'receipt.pdf', content_type: 'application/pdf')

    assert_equal 1, record.attachments.count
    assert_equal 'receipt.pdf', record.attachments.first.filename.to_s
  end

  test 'purges attachments on destroy' do
    vehicle = Vehicle.first || Vehicle.create!(name: 'Test Vehicle', user: User.first)
    record = vehicle.records.create!(date: Time.zone.today, notes: 'Oil change')
    file = file_fixture('receipt.pdf')
    record.attachments.attach(io: file.open, filename: 'receipt.pdf', content_type: 'application/pdf')
    signed_id = record.attachments.first.signed_id

    record.destroy!

    assert_nil ActiveStorage::Attachment.find_signed(signed_id)
  end
end
