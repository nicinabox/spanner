# frozen_string_literal: true

require 'test_helper'
require 'action_mailer/test_case'

class DailyRemindersJobTest < ActiveJob::TestCase
  setup do
    @user = users(:two)
    @user.reminders.first.update!(date: 2.weeks.from_now.to_date, reminder_type: 'date')
  end

  test 'sends upcoming reminders to active users' do
    @user.sessions.first.update!(last_seen: 1.day.ago)
    @user.update!(last_reminder_sent_at: nil)

    assert_emails 1 do
      DailyJob.new.upcoming_reminders
    end

    assert @user.reload.last_reminder_sent_at
  end

  test 'skips upcoming reminders for inactive users' do
    @user.sessions.first.update!(last_seen: 13.months.ago)
    @user.update!(last_reminder_sent_at: nil)

    assert_emails 0 do
      DailyJob.new.upcoming_reminders
    end

    assert_nil @user.reload.last_reminder_sent_at
  end

  test 'respects reminder backoff for upcoming reminders' do
    @user.sessions.first.update!(last_seen: 45.days.ago)
    @user.update!(last_reminder_sent_at: 6.days.ago)

    assert_emails 0 do
      DailyJob.new.upcoming_reminders
    end
  end
end
