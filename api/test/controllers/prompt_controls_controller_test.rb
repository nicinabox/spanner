require 'test_helper'

class V2::PromptControlsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @vehicle = vehicles(:one)
  end

  test 'remind me later snoozes prompts for one month' do
    token = NotificationToken.generate(vehicle_id: @vehicle.id, action: 'remind_me_later')

    post remind_me_later_url(token: token)

    assert_response :success
    assert_match 'snoozed for one month', response.body
    assert @vehicle.reload.prompt_snoozed_until
    assert @vehicle.prompt_snoozed_until > 3.weeks.from_now
  end

  test 'mute disables prompt emails' do
    assert @vehicle.preferences.send_prompt_for_records

    token = NotificationToken.generate(vehicle_id: @vehicle.id, action: 'mute')
    post mute_prompt_url(token: token)

    assert_response :success
    assert_match 'muted', response.body
    assert_not @vehicle.reload.preferences.send_prompt_for_records
  end

  test 'invalid token' do
    post remind_me_later_url(token: 'invalid')

    assert_response :not_found
    assert_match 'invalid or has expired', response.body
  end
end
