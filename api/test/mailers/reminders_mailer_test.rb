# frozen_string_literal: true

require 'test_helper'

class RemindersMailerTest < ActionMailer::TestCase
  setup do
    new_session

    @reminders = @user.reminders
  end

  test 'reminder_today' do
    mail = RemindersMailer.reminder_today(@user, @reminders)

    assert_equal 'Reminders for Mazda', mail.subject
    assert_equal ['user1@test'], mail.to
    assert_equal [ENV.fetch('FROM_EMAIL', 'noreply@localhost')], mail.from
    assert_match 'Hello', mail.body.encoded
    assert_match 'data:image/png;base64,', mail.body.encoded
  end

  test 'reminder_upcoming' do
    user = User.find 2
    reminders = user.reminders

    mail = RemindersMailer.reminder_upcoming(user, reminders)

    assert_equal 'Reminders for Honda', mail.subject
    assert_equal ['user2@test'], mail.to
    assert_equal [ENV.fetch('FROM_EMAIL', 'noreply@localhost')], mail.from
    assert_match '14 days', mail.body.encoded
  end

  test 'reminder_today includes preferences link' do
    user = User.create!(email: 'prefs-link-test@example.com')
    user.generate_account_token!
    vehicle = user.vehicles.create!(name: 'Test Car', distance_unit: 'mi')
    reminder = Reminder.new(notes: 'Oil change', vehicle: vehicle, date: Time.zone.today)

    mail = RemindersMailer.reminder_today(user, [reminder])
    expected_url = ApplicationMailer.new.frontend_preferences_url(user.account_token)
    expected_vehicle_url = ApplicationMailer.new.frontend_preferences_url(user.account_token, vehicle_id: vehicle.id)

    assert_match 'Manage email preferences', mail.html_part.body.to_s
    assert_match expected_url, mail.html_part.body.to_s
    assert_match 'Manage notifications for Test Car', mail.html_part.body.to_s
    assert_match expected_vehicle_url, mail.html_part.body.to_s
    assert_match 'Manage email preferences', mail.text_part.body.to_s
  end

  test 'reminder_today omits footer when user is unsubscribed' do
    user = User.create!(email: 'unsubs-test@example.com')
    user.generate_account_token!
    user.update!(unsubscribed_at: Time.zone.now)
    vehicle = user.vehicles.create!(name: 'Test Car', distance_unit: 'mi')
    reminder = Reminder.new(notes: 'Oil change', vehicle: vehicle, date: Time.zone.today)

    mail = RemindersMailer.reminder_today(user, [reminder])

    refute_match 'Manage email preferences', mail.html_part.body.to_s
  end

  test 'new users get an account_token automatically' do
    user = User.create!(email: 'autotoken-test@example.com')
    assert_not_nil user.account_token
  end
end
