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
          notes: 'oil change'
        }
      }
    })

    assert response_body['notes'] == 'oil change'
  end

  test "deletes all reminders for vehicle" do
    vehicle = @user.vehicles.first

    delete vehicle_reminder_url(vehicle, vehicle.reminders.last), http_options(@session.auth_token)
    assert_response :success

    get vehicle_reminders_url(vehicle), http_options(@session.auth_token)
    assert response_body.size == 0
  end

  test "mileage based reminder" do
    vehicle = @user.vehicles.first
    days = 5000 / vehicle.miles_per_day

    post vehicle_reminders_url(vehicle), http_options(@session.auth_token).merge(
      params: {
        reminder: {
          notes: 'Oil change',
          mileage: 5000,
          reminder_type: 'mileage'
        }
      }
    )

    assert_not_empty response_body['date']
  end
end
