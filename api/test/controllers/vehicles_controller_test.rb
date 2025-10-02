require 'test_helper'

class VehiclesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(email: "testuser@example.com")
    @session = @user.sessions.create!(
      auth_token: "testtoken123",
      auth_token_valid_until: 1.day.from_now,
      last_seen: Time.now
    )
    @vehicle = @user.vehicles.create!(name: "Honda Civic")
    @headers = {
      accept: "application/json; version=2",
      authorization: "Token #{@session.auth_token}"
    }
  end

  test "returns all vehicles" do
    get vehicles_url, headers: @headers
    assert_response :success
    body = JSON.parse(@response.body)
    assert_equal 1, body.size
    assert_equal @vehicle.name, body.first['name']
  end

  test "update a vehicle" do
    put vehicle_url(@vehicle), params: { vehicle: { name: 'Mini Cooper' } }, headers: @headers
    assert_response :success
    body = JSON.parse(@response.body)
    assert_equal 'Mini Cooper', body['name']
    @vehicle.reload
    assert_equal 'Mini Cooper', @vehicle.name
  end

  test "delete vehicle" do
    delete vehicle_url(@vehicle), headers: @headers
    assert_response :no_content
    @user.reload
    assert_equal 0, @user.vehicles.count
  end
  test "show a vehicle" do
    get vehicle_url(@vehicle), headers: @headers
    assert_response :success
    body = JSON.parse(@response.body)
    assert_equal @vehicle.name, body['name']
  end

  test "share a vehicle with sharing enabled" do
    @vehicle.update!(preferences: { enable_sharing: true })
    get vehicle_share_url(@vehicle), headers: @headers
    assert_response :success
    body = JSON.parse(@response.body)
    assert_equal @vehicle.id, body['id']
  end

  test "share a vehicle with sharing disabled" do
    @vehicle.update!(preferences: { enable_sharing: false })
    get vehicle_share_url(@vehicle), headers: @headers
    assert_response :unauthorized
  end

  test "create a vehicle" do
    assert_difference('@user.vehicles.count', 1) do
      post vehicles_url, params: { vehicle: { name: "Toyota" } }, headers: @headers
    end
    assert_response :success
    body = JSON.parse(@response.body)
    assert_equal "Toyota", body['name']
  end
end
