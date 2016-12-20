require 'test_helper'

class RemindersControllerTest < ActionDispatch::IntegrationTest
  setup do
    new_session
  end

  test "returns all reminders for vehicle" do
    vehicle = @user.vehicles.first

    get vehicle_reminders_url(vehicle), http_options(@session.auth_token)
    assert response_body.size == vehicle.reminders.count
  end

  test "update a reminder" do
    vehicle = @user.vehicles.first
    reminder = vehicle.reminders.first

    put vehicle_reminder_url(vehicle, reminder), http_options(@session.auth_token).merge({
      params: {
        reminder: {
          reminder: 'oil change'
        }
      }
    })

    assert response_body['reminder'] == 'oil change'
  end

  test "deletes all reminders for vehicle" do
    vehicle = @user.vehicles.first

    delete vehicle_reminder_url(vehicle.id, vehicle.reminders.last.id), http_options(@session.auth_token)
    assert_response :success

    get vehicle_reminders_url(vehicle), http_options(@session.auth_token)
    assert response_body.size == 0
  end
end
