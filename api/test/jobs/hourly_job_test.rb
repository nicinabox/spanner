# frozen_string_literal: true

require 'test_helper'
require 'action_mailer/test_case'

class HourlyJobTest < ActiveJob::TestCase
  include ActiveSupport::Testing::TimeHelpers

  setup do
    # The user is in UTC-2, so midnight for them is 02:00 UTC. Freeze time so
    # HourlyJob#find_midnight_timezone reliably finds the matching zone.
    travel_to Time.utc(2026, 1, 15, 2, 0, 0)

    @user = users(:one)
    @user.update!(time_zone_offset: '-2')
  end

  teardown do
    travel_back
  end

  test 'sends today reminders to active users' do
    travel_to Time.utc(2026, 6, 19, 2, 0, 0) do
      @user.reminders.first.update!(date: Time.zone.today, reminder_type: 'date')
      @user.sessions.first.update!(last_seen: 1.day.ago)
      @user.update!(last_reminder_sent_at: nil)

      assert_emails 1 do
        HourlyJob.new.today_reminders_in_timezone
      end

      assert @user.reload.last_reminder_sent_at
    end
  end

  test 'skips today reminders for inactive users' do
    travel_to Time.utc(2026, 6, 19, 2, 0, 0) do
      @user.reminders.first.update!(date: Time.zone.today, reminder_type: 'date')
      @user.sessions.first.update!(last_seen: 13.months.ago)
      @user.update!(last_reminder_sent_at: nil)

      assert_emails 0 do
        HourlyJob.new.today_reminders_in_timezone
      end

      assert_nil @user.reload.last_reminder_sent_at
    end
  end

  test 'respects reminder backoff for today reminders' do
    travel_to Time.utc(2026, 6, 19, 2, 0, 0) do
      @user.reminders.first.update!(date: Time.zone.today, reminder_type: 'date')
      @user.sessions.first.update!(last_seen: 45.days.ago)
      @user.update!(last_reminder_sent_at: 6.days.ago)

      assert_emails 0 do
        HourlyJob.new.today_reminders_in_timezone
      end
    end
  end
end
