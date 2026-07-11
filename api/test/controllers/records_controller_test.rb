# frozen_string_literal: true

require 'test_helper'

class RecordsControllerTest < ActionDispatch::IntegrationTest
  setup do
    new_session
    @vehicle = @user.vehicles.first
    @oil = Classification.create!(
      name: 'Oil Change',
      vehicle: @vehicle,
      keywords: ['oil change', 'engine oil', 'motor oil', 'oil filter'],
      system: false
    )
    @other = Classification.create!(
      name: 'Other',
      vehicle: @vehicle,
      keywords: ['other service'],
      system: false
    )
  end

  test 'returns all records for vehicle' do
    get vehicle_records_url(@vehicle), headers: http_options(@session.auth_token)[:headers]
    assert response_body.size == @vehicle.records.count
  end

  test 'update a record' do
    record = @vehicle.records.first

    put vehicle_record_url(@vehicle, record), params: { record: { mileage: 4 } },
                                              headers: http_options(@session.auth_token)[:headers]

    assert response_body['mileage'] == 4
  end

  test 'deletes all records for vehicle' do
    delete vehicle_record_url(@vehicle.id, @vehicle.records.last.id),
           headers: http_options(@session.auth_token)[:headers]
    assert_response :success

    get vehicle_records_url(@vehicle), headers: http_options(@session.auth_token)[:headers]
    assert response_body.size == 1
  end

  test 'creates a record with attachments' do
    file = Rack::Test::UploadedFile.new(file_fixture('receipt.pdf').to_s, 'application/pdf')
    post vehicle_records_url(@vehicle),
         params: { record: { date: Time.zone.today, notes: 'Oil change', attachments: [file] } },
         headers: http_options(@session.auth_token)[:headers]

    assert_response :success
    body = response_body
    assert body['attachments'].is_a?(Array)
    assert_equal 1, body['attachments'].size
    assert_equal 'receipt.pdf', body['attachments'].first['filename']
  end

  test 'appends attachments on update without removing existing ones' do
    record = @vehicle.records.first

    file = Rack::Test::UploadedFile.new(file_fixture('receipt.pdf').to_s, 'application/pdf')
    put vehicle_record_url(@vehicle, record),
        params: { record: { attachments: [file] } },
        headers: http_options(@session.auth_token)[:headers]

    assert_response :success
    assert_equal 1, response_body['attachments'].size

    file2 = Rack::Test::UploadedFile.new(file_fixture('receipt.pdf').to_s, 'application/pdf')
    put vehicle_record_url(@vehicle, record),
        params: { record: { attachments: [file2] } },
        headers: http_options(@session.auth_token)[:headers]

    assert_response :success
    assert_equal 2, response_body['attachments'].size
  end

  test 'rejects an attachment exceeding 10MB' do
    large_file = Tempfile.new('large.bin')
    large_file.write('x' * (Record::MAX_ATTACHMENT_SIZE + 1))
    large_file.rewind
    uploaded = Rack::Test::UploadedFile.new(large_file.path, 'application/octet-stream')

    post vehicle_records_url(@vehicle),
         params: { record: { date: Time.zone.today, notes: 'Oil change', attachments: [uploaded] } },
         headers: http_options(@session.auth_token)[:headers]

    assert_response :unprocessable_entity
  end

  test 'auto-tags new classifications without removing existing ones' do
    # Manually add 'other' to a record
    record = @vehicle.records.create!(date: Time.zone.today, notes: 'Some notes')
    record.record_classifications.create!(classification: @other, classifier: 'manual', confidence: 1.0,
                                          auto_tagged: false)

    # Create a service schedule for oil so auto-tagging activates
    @vehicle.service_schedules.create!(classification: @oil, distance_interval: 5000)

    # Update notes to match oil change — should auto-tag oil without removing other
    put vehicle_record_url(@vehicle, record),
        params: { record: { notes: 'Oil change and other service' } },
        headers: http_options(@session.auth_token)[:headers]

    assert_response :success
    assert_includes record.classifications.reload.pluck(:id), @other.id
    assert_includes record.classifications.pluck(:id), @oil.id
  end

  test 'does not duplicate existing classifications on re-save' do
    @vehicle.service_schedules.create!(classification: @oil, distance_interval: 5000)

    record = @vehicle.records.create!(date: Time.zone.today, notes: 'Oil change')
    assert_equal 1, record.classifications.reload.size

    # Re-save with same notes — should not duplicate
    put vehicle_record_url(@vehicle, record),
        params: { record: { notes: 'Oil change' } },
        headers: http_options(@session.auth_token)[:headers]

    assert_response :success
    assert_equal 1, record.classifications.reload.size
  end

  test 'syncs classifications from form selection' do
    c1 = Classification.create!(name: 'Test One', vehicle: @vehicle, keywords: ['one'], system: false)
    c2 = Classification.create!(name: 'Test Two', vehicle: @vehicle, keywords: ['two'], system: false)

    record = @vehicle.records.create!(date: Time.zone.today, notes: 'Some notes')
    record.record_classifications.create!(classification: c1, classifier: 'manual', confidence: 1.0, auto_tagged: false)
    record.record_classifications.create!(classification: c2, classifier: 'manual', confidence: 1.0, auto_tagged: false)
    assert_equal 2, record.classifications.reload.size

    # Update with only c1 selected — c2 should be removed
    put vehicle_record_url(@vehicle, record),
        params: { record: { classification_ids: [c1.id] } },
        headers: http_options(@session.auth_token)[:headers]

    assert_response :success
    assert_equal [c1.id], record.classifications.reload.pluck(:id)
  end

  test 'deletes a single attachment' do
    record = @vehicle.records.create!(date: Time.zone.today, notes: 'Oil change')
    file = Rack::Test::UploadedFile.new(file_fixture('receipt.pdf').to_s, 'application/pdf')
    record.attachments.attach(io: file.respond_to?(:read) ? file : File.open(file), filename: 'receipt.pdf',
                              content_type: 'application/pdf')
    signed_id = record.attachments.first.signed_id

    delete vehicle_record_attachment_url(@vehicle, record, signed_id),
           headers: http_options(@session.auth_token)[:headers]
    assert_response :no_content

    get vehicle_record_url(@vehicle, record), headers: http_options(@session.auth_token)[:headers]
    assert_equal 0, response_body['attachments'].size
  end
end
