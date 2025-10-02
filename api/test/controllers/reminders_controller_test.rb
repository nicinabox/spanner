require 'test_helper'

class RemindersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(email: "testuser@example.com")
    @session = @user.sessions.create!(
      auth_token: "testtoken123",
      auth_token_valid_until: 1.day.from_now,
      last_seen: Time.now
    )
    @vehicle = @user.vehicles.create!(name: "Mazda")
    @reminder = @vehicle.reminders.create!(notes: "Oil change", date: Date.today + 7, mileage: 1000, reminder_type: "date")
    @headers = {
      accept: "application/json; version=2",
      authorization: "Token #{@session.auth_token}"
    }
  end

  test "returns all reminders for vehicle" do
    get vehicle_reminders_url(@vehicle), headers: @headers
    assert_response :success
    body = JSON.parse(@response.body)
    assert_equal @vehicle.reminders.count, body.size
  end

  test "show a reminder" do
    get vehicle_reminder_url(@vehicle, @reminder), headers: @headers
    assert_response :success
    body = JSON.parse(@response.body)
    assert_equal @reminder.notes, body['notes']
  end

  test "create a reminder" do
    assert_difference('@vehicle.reminders.count', 1) do
      post vehicle_reminders_url(@vehicle), params: { reminder: { notes: "Tire rotation", date: Date.today + 14, mileage: 2000, reminder_type: "date" } }, headers: @headers
    end
    assert_response :success
    body = JSON.parse(@response.body)
    assert_equal "Tire rotation", body['notes']
  end

  test "update a reminder" do
    put vehicle_reminder_url(@vehicle, @reminder), params: { reminder: { notes: 'Changed oil' } }, headers: @headers
    assert_response :success
    body = JSON.parse(@response.body)
    assert_equal 'Changed oil', body['notes']
    @reminder.reload
    assert_equal 'Changed oil', @reminder.notes
  end

  test "deletes a reminder" do
    assert_difference('@vehicle.reminders.count', -1) do
      delete vehicle_reminder_url(@vehicle, @reminder), headers: @headers
    end
    assert_response :no_content
  end

  test "estimate date" do
    get vehicle_reminders_estimate_date_url(@vehicle), params: { reminder: { notes: "Oil change", mileage: 5000, reminder_type: "mileage" } }, headers: @headers
    assert_response :success
    body = JSON.parse(@response.body)
    assert body.has_key?('reminder_date')
  end
end
