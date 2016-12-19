require 'test_helper'

class RecordsControllerTest < ActionDispatch::IntegrationTest
  setup do
    new_session
  end

  test "returns empty records for vehicle" do
    vehicle = @user.vehicles.create(name: 'Mazda')

    get vehicle_records_url(vehicle), http_options(@session.auth_token)
    assert_equal [], response_body
  end

  test "returns all records for vehicle" do
    vehicle = @user.vehicles.create(name: 'Mazda')
    5.times do |n|
      vehicle.records.create(date: Time.now, notes: n)
    end

    get vehicle_records_url(vehicle), http_options(@session.auth_token)
    assert response_body.size == 5
  end
end
