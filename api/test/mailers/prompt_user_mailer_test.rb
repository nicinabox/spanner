# frozen_string_literal: true

require 'test_helper'

class PromptUserMailerTest < ActionMailer::TestCase
  setup do
    @user = User.create!(email: "prompt-test-#{Time.now.to_i}@example.com")
    @user.generate_account_token!
    @vehicle = @user.vehicles.create!(name: 'Test Car', distance_unit: 'mi')
  end

  test 'add_first_vehicle includes preferences link' do
    mail = PromptUserMailer.add_first_vehicle(@user)
    expected_url = ApplicationMailer.new.frontend_preferences_url(@user.account_token)

    assert_match 'Manage email preferences', mail.html_part.body.to_s
    assert_match expected_url, mail.html_part.body.to_s
  end

  test 'add_first_vehicle has no per-vehicle link' do
    mail = PromptUserMailer.add_first_vehicle(@user)

    refute_match 'Notifications for', mail.html_part.body.to_s
  end

  test 'add_record includes per-vehicle preferences link' do
    mail = PromptUserMailer.add_record(@user, @vehicle)
    expected_url = ApplicationMailer.new.frontend_preferences_url(@user.account_token, vehicle_id: @vehicle.id)

    assert_match 'Notifications for Test Car', mail.html_part.body.to_s
    assert_match expected_url, mail.html_part.body.to_s
  end

  test 'add_first_record includes per-vehicle preferences link' do
    mail = PromptUserMailer.add_first_record(@user, @vehicle)
    expected_url = ApplicationMailer.new.frontend_preferences_url(@user.account_token, vehicle_id: @vehicle.id)

    assert_match 'Notifications for Test Car', mail.html_part.body.to_s
    assert_match expected_url, mail.html_part.body.to_s
  end
end