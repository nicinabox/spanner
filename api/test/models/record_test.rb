# frozen_string_literal: true

require 'test_helper'

class RecordTest < ActiveSupport::TestCase
  test 'classify_notes on save' do
    vehicle = Vehicle.first || Vehicle.create!(name: 'Test Vehicle', user: User.first)

    oil_class = Classification.create!(
      name: 'Oil Change',
      vehicle: vehicle,
      keywords: ['oil change', 'engine oil', 'motor oil', 'oil filter']
    )
    vehicle.service_schedules.find_or_create_by!(classification: oil_class) do |s|
      s.distance_interval = 5000
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
      is_oil_change = record.classifications.exists?(id: oil_class.id)

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

  test 'updating record mileage recalculates matching service schedules' do
    vehicle = Vehicle.create!(name: 'Test Car', user: User.first)
    classification = Classification.create!(
      name: 'Oil Change',
      vehicle: vehicle,
      keywords: ['oil change']
    )

    schedule = vehicle.service_schedules.find_or_create_by!(classification: classification) do |s|
      s.distance_interval = 5000
    end
    schedule.update!(distance_interval: 5000)

    record = vehicle.records.create!(
      date: 30.days.ago,
      notes: 'Oil change',
      mileage: 50_000
    )
    record.classifications << classification unless record.classifications.include?(classification)
    schedule.recalculate_next_due
    assert_equal 55_000, schedule.reload.next_due_mileage

    record.update!(mileage: 55_000)
    assert_equal 60_000, schedule.reload.next_due_mileage
  end

  test 'rejects attachment exceeding 10MB' do
    # Create a real temp file over 10MB
    Tempfile.create(['large', '.pdf'], binmode: true) do |f|
      f.write('x' * (11 * 1024 * 1024))
      f.rewind

      assert_raises SecureAttachments::SecureAttachmentError, /exceeds/ do
        SecureAttachments.validate_files!([f])
      end
    end
  end

  test 'rejects disallowed content type' do
    Tempfile.create(['virus', '.exe'], binmode: true) do |f|
      f.write("MZ\x90\x00\x03\x00\x00\x00") # PE header
      f.rewind

      assert_raises SecureAttachments::SecureAttachmentError, /not allowed/ do
        SecureAttachments.validate_files!([f])
      end
    end
  end

  test 'accepts valid PDF attachment' do
    Tempfile.create(['receipt', '.pdf'], binmode: true) do |f|
      f.write('%PDF-1.4 fake pdf content')
      f.rewind

      # Should not raise
      assert_nothing_raised { SecureAttachments.validate_files!([f]) }
    end
  end

  test 'accepts valid JPEG attachment' do
    Tempfile.create(['photo', '.jpg'], binmode: true) do |f|
      f.write("\xFF\xD8\xFF\xE0 fake jpeg content")
      f.rewind

      # Should not raise
      assert_nothing_raised { SecureAttachments.validate_files!([f]) }
    end
  end

  test 'rejects mismatched magic bytes' do
    Vehicle.first || Vehicle.create!(name: 'Test Vehicle', user: User.first)

    # Claims to be PDF but is actually text
    Tempfile.create(['fake', '.pdf'], binmode: true) do |f|
      f.write('This is not a PDF file')
      f.rewind

      assert_raises SecureAttachments::SecureAttachmentError do
        SecureAttachments.validate_files!([f])
      end
    end
  end

  test 'rejects attachment count exceeding 10' do
    vehicle = Vehicle.first || Vehicle.create!(name: 'Test Vehicle', user: User.first)
    record = vehicle.records.new(date: Time.zone.today, notes: 'Many files')

    11.times do |i|
      Tempfile.create(['file', '.txt'], binmode: true) do |f|
        f.write("file content #{i}")
        f.rewind

        record.attachments.attach(io: f, filename: "file#{i}.txt", content_type: 'text/plain')
      end
    end

    assert_not record.valid?
    assert_includes record.errors[:attachments].join, 'count exceeds'
  end
end
