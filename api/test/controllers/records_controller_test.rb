require 'test_helper'

class RecordsControllerTest < ActionDispatch::IntegrationTest
  setup do
    new_session
  end

  test "returns all records for vehicle" do
    vehicle = @user.vehicles.first

    get vehicle_records_url(vehicle), http_options(@session.auth_token)
    assert response_body.size == vehicle.records.count
  end

  test "update a record" do
    vehicle = @user.vehicles.first
    record = vehicle.records.first

    put vehicle_record_url(vehicle, record), http_options(@session.auth_token).merge({
      params: {
        record: {
          mileage: 4
        }
      }
    })

    assert response_body['mileage'] == 4
  end

  test "deletes all records for vehicle" do
    vehicle = @user.vehicles.first

    delete vehicle_record_url(vehicle.id, vehicle.records.last.id), http_options(@session.auth_token)
    assert_response :success

    get vehicle_records_url(vehicle), http_options(@session.auth_token)
    assert response_body.size == 1
  end
end
