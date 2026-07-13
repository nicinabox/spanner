# frozen_string_literal: true

require 'test_helper'
require 'action_mailer/test_case'

class DailyJobTest < ActiveJob::TestCase
  setup do
    @user = users(:two)
    @vehicle = @user.vehicles.first
    @classification_a = Classification.create!(
      name: 'Oil Change',
      vehicle: @vehicle,
      keywords: ['oil']
    )
    @classification_b = Classification.create!(
      name: 'Tire Rotation',
      vehicle: @vehicle,
      keywords: ['tire']
    )
    @classification_c = Classification.create!(
      name: 'Brake Inspection',
      vehicle: @vehicle,
      keywords: ['brake']
    )
    @user.sessions.first&.update!(last_seen: 1.day.ago)
    @user.update!(last_reminder_sent_at: nil)
  end

  test 'upcoming_schedules excludes schedules due today (handled by HourlyJob)' do
    due_today = @vehicle.service_schedules.create!(
      classification: @classification_a,
      distance_interval: 5000,
      next_due_date: Time.zone.today
    )
    due_tomorrow = @vehicle.service_schedules.create!(
      classification: @classification_b,
      distance_interval: 5000,
      next_due_date: 1.day.from_now.to_date
    )
    due_two_weeks = @vehicle.service_schedules.create!(
      classification: @classification_c,
      distance_interval: 5000,
      next_due_date: 2.weeks.from_now.to_date
    )

    assert_emails 1 do
      DailyJob.new.upcoming_schedules
    end

    email = ActionMailer::Base.deliveries.last
    body = email.body.encoded
    [due_tomorrow, due_two_weeks].each do |schedule|
      assert_includes body, schedule.classification.name,
                      "expected upcoming email to include #{schedule.classification.name}"
    end
    assert_not_includes body, due_today.classification.name,
                        'expected upcoming email NOT to include schedule due today'
  end
end
