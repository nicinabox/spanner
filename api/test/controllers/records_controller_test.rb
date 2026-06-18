# frozen_string_literal: true

require 'test_helper'

class RecordsControllerTest < ActionDispatch::IntegrationTest
  setup do
    new_session
  end

  test 'returns all records for vehicle' do
    vehicle = @user.vehicles.first

    get vehicle_records_url(vehicle), headers: http_options(@session.auth_token)[:headers]
    assert response_body.size == vehicle.records.count
  end

  test 'update a record' do
    vehicle = @user.vehicles.first
    record = vehicle.records.first

    put vehicle_record_url(vehicle, record), params: { record: { mileage: 4 } },
                                             headers: http_options(@session.auth_token)[:headers]

    assert response_body['mileage'] == 4
  end

  test 'deletes all records for vehicle' do
    vehicle = @user.vehicles.first

    delete vehicle_record_url(vehicle.id, vehicle.records.last.id), headers: http_options(@session.auth_token)[:headers]
    assert_response :success

    get vehicle_records_url(vehicle), headers: http_options(@session.auth_token)[:headers]
    assert response_body.size == 1
  end

  test 'creates a record with attachments' do
    vehicle = @user.vehicles.first

    file = Rack::Test::UploadedFile.new(file_fixture('receipt.pdf').to_s, 'application/pdf')
    post vehicle_records_url(vehicle),
         params: { record: { date: Time.zone.today, notes: 'Oil change', attachments: [file] } },
         headers: http_options(@session.auth_token)[:headers]

    assert_response :success
    body = response_body
    assert body['attachments'].is_a?(Array)
    assert_equal 1, body['attachments'].size
    assert_equal 'receipt.pdf', body['attachments'].first['filename']
  end

  test 'appends attachments on update without removing existing ones' do
    vehicle = @user.vehicles.first
    record = vehicle.records.first

    file = Rack::Test::UploadedFile.new(file_fixture('receipt.pdf').to_s, 'application/pdf')
    put vehicle_record_url(vehicle, record),
        params: { record: { attachments: [file] } },
        headers: http_options(@session.auth_token)[:headers]

    assert_response :success
    assert_equal 1, response_body['attachments'].size

    file2 = Rack::Test::UploadedFile.new(file_fixture('receipt.pdf').to_s, 'application/pdf')
    put vehicle_record_url(vehicle, record),
        params: { record: { attachments: [file2] } },
        headers: http_options(@session.auth_token)[:headers]

    assert_response :success
    assert_equal 2, response_body['attachments'].size
  end

  test 'rejects an attachment exceeding 10MB' do
    vehicle = @user.vehicles.first

    large_file = Tempfile.new('large.bin')
    large_file.write('x' * (Record::MAX_ATTACHMENT_SIZE + 1))
    large_file.rewind
    uploaded = Rack::Test::UploadedFile.new(large_file.path, 'application/octet-stream')

    post vehicle_records_url(vehicle),
         params: { record: { date: Time.zone.today, notes: 'Oil change', attachments: [uploaded] } },
         headers: http_options(@session.auth_token)[:headers]

    assert_response :unprocessable_entity
  end

  test 'deletes a single attachment' do
    vehicle = @user.vehicles.first
    record = vehicle.records.create!(date: Time.zone.today, notes: 'Oil change')
    file = Rack::Test::UploadedFile.new(file_fixture('receipt.pdf').to_s, 'application/pdf')
    record.attachments.attach(io: file.respond_to?(:read) ? file : File.open(file), filename: 'receipt.pdf',
                              content_type: 'application/pdf')
    signed_id = record.attachments.first.signed_id

    delete vehicle_record_attachment_url(vehicle, record, signed_id),
           headers: http_options(@session.auth_token)[:headers]
    assert_response :no_content

    get vehicle_record_url(vehicle, record), headers: http_options(@session.auth_token)[:headers]
    assert_equal 0, response_body['attachments'].size
  end
end
