require 'test_helper'

class V2::UnsubscribesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @vehicle = vehicles(:one)
  end

  test 'unsubscribe from prompt emails' do
    assert @vehicle.preferences.send_prompt_for_records

    token = NotificationToken.generate(vehicle_id: @vehicle.id, action: 'prompt')
    get unsubscribe_url(token: token)

    assert_response :success
    assert_match 'unsubscribed', response.body
    assert_not @vehicle.reload.preferences.send_prompt_for_records
  end

  test 'unsubscribe from reminder emails' do
    assert @vehicle.preferences.send_reminder_emails

    token = NotificationToken.generate(vehicle_id: @vehicle.id, action: 'reminders')
    get unsubscribe_url(token: token)

    assert_response :success
    assert_match 'unsubscribed', response.body
    assert_not @vehicle.reload.preferences.send_reminder_emails
  end

  test 'invalid token' do
    get unsubscribe_url(token: 'invalid')

    assert_response :not_found
    assert_match 'invalid or has expired', response.body
  end
end
