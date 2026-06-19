# frozen_string_literal: true

require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test 'active user is reminder eligible' do
    user = users(:one)
    user.sessions.first.update!(last_seen: 1.day.ago)
    user.update!(last_reminder_sent_at: nil, created_at: 2.years.ago)

    assert user.reminder_eligible?
  end

  test 'reminder eligible when enough time has passed since last reminder' do
    user = users(:one)
    user.sessions.first.update!(last_seen: 45.days.ago)
    user.update!(last_reminder_sent_at: 8.days.ago)

    assert user.reminder_eligible?
  end

  test 'reminder not eligible when backoff has not elapsed' do
    user = users(:one)
    user.sessions.first.update!(last_seen: 45.days.ago)
    user.update!(last_reminder_sent_at: 6.days.ago)

    assert_not user.reminder_eligible?
  end

  test 'reminder not eligible when user has not logged in for more than a year' do
    user = users(:one)
    user.sessions.first.update!(last_seen: 13.months.ago)
    user.update!(last_reminder_sent_at: nil)

    assert_not user.reminder_eligible?
  end

  test 'reminder not eligible when there are no sessions and the account is old' do
    user = users(:one)
    user.sessions.destroy_all
    user.update!(created_at: 13.months.ago, last_reminder_sent_at: nil)

    assert_not user.reminder_eligible?
  end

  test 'reminder eligible when there are no sessions and the account is recent' do
    user = users(:one)
    user.sessions.destroy_all
    user.update!(created_at: 1.week.ago, last_reminder_sent_at: nil)

    assert user.reminder_eligible?
  end

  test 'record_reminder_sent! updates timestamp' do
    user = users(:one)
    freeze_time do
      user.record_reminder_sent!
      assert_equal Time.zone.now, user.reload.last_reminder_sent_at
    end
  end

  test 'admin defaults to false for a new user' do
    user = User.create!(email: 'newadmin@example.com')
    assert_equal false, user.admin
    assert_not user.admin?
  end

  test 'admin? reflects the admin flag' do
    user = users(:admin)
    assert user.admin?
  end

  test 'reminder_backoff_interval increases with inactivity' do
    user = users(:one)

    user.sessions.first.update!(last_seen: 10.days.ago)
    assert_equal 0.days.to_i, user.reminder_backoff_interval.to_i

    user.sessions.first.update!(last_seen: 35.days.ago)
    assert_equal 7.days.to_i, user.reminder_backoff_interval.to_i

    user.sessions.first.update!(last_seen: 100.days.ago)
    assert_equal 14.days.to_i, user.reminder_backoff_interval.to_i

    user.sessions.first.update!(last_seen: 200.days.ago)
    assert_equal 30.days.to_i, user.reminder_backoff_interval.to_i
  end

  test 'request_email_change! stores unconfirmed email without changing email' do
    user = users(:one)

    user.request_email_change!('new@example.com')

    assert_equal 'user1@test', user.reload.email
    assert_equal 'new@example.com', user.unconfirmed_email
    assert_not_nil user.email_confirmation_token
    assert user.email_confirmation_token_valid_until > Time.zone.now
  end

  test 'request_email_change! normalizes the new email' do
    user = users(:one)

    user.request_email_change!('  NEW@Example.com  ')

    assert_equal 'new@example.com', user.reload.unconfirmed_email
  end

  test 'request_email_change! rejects a blank email' do
    user = users(:one)

    assert_raises(ActiveRecord::RecordInvalid) { user.request_email_change!('') }
    assert_raises(ActiveRecord::RecordInvalid) { user.request_email_change!('   ') }
  end

  test 'request_email_change! rejects the current email' do
    user = users(:one)

    assert_raises(ActiveRecord::RecordInvalid) { user.request_email_change!(user.email) }
  end

  test 'request_email_change! rejects a duplicate email' do
    user = users(:one)
    other = users(:two)

    assert_raises(ActiveRecord::RecordInvalid) { user.request_email_change!(other.email) }
  end

  test 'confirm_email_change! commits the new email and clears the token' do
    user = users(:one)
    user.request_email_change!('new@example.com')
    token = user.reload.email_confirmation_token

    confirmed = User.confirm_email_change!(token)

    assert_equal user, confirmed
    assert_equal 'new@example.com', user.reload.email
    assert_nil user.unconfirmed_email
    assert_nil user.email_confirmation_token
    assert_nil user.email_confirmation_token_valid_until
  end

  test 'confirm_email_change! returns nil for an invalid token' do
    assert_nil User.confirm_email_change!('does-not-exist')
  end

  test 'confirm_email_change! returns nil for an expired token' do
    user = users(:one)
    user.request_email_change!('new@example.com')
    user.update!(email_confirmation_token_valid_until: 1.minute.ago)

    assert_nil User.confirm_email_change!(user.reload.email_confirmation_token)
    assert_equal 'user1@test', user.reload.email
    assert_equal 'new@example.com', user.unconfirmed_email
  end

  test 'confirm_email_change! rejects a token whose new email is already taken' do
    user = users(:one)
    user.request_email_change!('new@example.com')
    token = user.reload.email_confirmation_token

    User.create!(email: 'new@example.com')

    assert_nil User.confirm_email_change!(token)
    assert_equal 'user1@test', user.reload.email
  end
end
