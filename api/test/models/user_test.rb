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
end
