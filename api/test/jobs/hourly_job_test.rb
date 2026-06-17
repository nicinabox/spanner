# frozen_string_literal: true

require 'test_helper'
require 'action_mailer/test_case'

class HourlyJobTest < ActiveJob::TestCase
  setup do
    @user = users(:one)
    @user.update!(time_zone_offset: '-2')
    @user.reminders.first.update!(date: Time.zone.today, reminder_type: 'date')
  end

  test 'sends today reminders to active users' do
    @user.sessions.first.update!(last_seen: 1.day.ago)
    @user.update!(last_reminder_sent_at: nil)

    assert_emails 1 do
      HourlyJob.new.today_reminders_in_timezone
    end

    assert @user.reload.last_reminder_sent_at
  end

  test 'skips today reminders for inactive users' do
    @user.sessions.first.update!(last_seen: 13.months.ago)
    @user.update!(last_reminder_sent_at: nil)

    assert_emails 0 do
      HourlyJob.new.today_reminders_in_timezone
    end

    assert_nil @user.reload.last_reminder_sent_at
  end

  test 'respects reminder backoff for today reminders' do
    @user.sessions.first.update!(last_seen: 45.days.ago)
    @user.update!(last_reminder_sent_at: 6.days.ago)

    assert_emails 0 do
      HourlyJob.new.today_reminders_in_timezone
    end
  end
end
