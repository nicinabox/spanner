require 'test_helper'

class VehiclesControllerTest < ActionDispatch::IntegrationTest
  setup do
    new_session
  end

  test "returns all vehicles" do
    get vehicles_url, http_options(@session.auth_token)
    assert response_body.size == 1
  end

  test "update a vehicle" do
    vehicle = @user.vehicles.first
    put vehicle_url(vehicle), http_options(@session.auth_token).merge({
      params: {
        vehicle: {
          name: 'Mini Cooper'
        }
      }
    })

    assert response_body['name'] == 'Mini Cooper'
  end

  test "delete vehicle" do
    vehicle = @user.vehicles.first
    delete vehicle_url(vehicle), http_options(@session.auth_token)
    assert @user.vehicles.count == 0
  end
end
