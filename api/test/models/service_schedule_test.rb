# frozen_string_literal: true

require 'test_helper'

class ServiceScheduleTest < ActiveSupport::TestCase
  setup do
    @user = User.first
    @vehicle = @user.vehicles.first
    @classification = Classification.find_by!(key: 'oil_change')
  end

  test 'valid with mileage_interval' do
    schedule = ServiceSchedule.new(
      vehicle: @vehicle,
      classification: @classification,
      mileage_interval: 5000
    )
    assert schedule.valid?
  end

  test 'valid with month_interval' do
    schedule = ServiceSchedule.new(
      vehicle: @vehicle,
      classification: @classification,
      month_interval: 12
    )
    assert schedule.valid?
  end

  test 'valid with both intervals' do
    schedule = ServiceSchedule.new(
      vehicle: @vehicle,
      classification: @classification,
      mileage_interval: 5000,
      month_interval: 12
    )
    assert schedule.valid?
  end

  test 'invalid without any interval' do
    schedule = ServiceSchedule.new(
      vehicle: @vehicle,
      classification: @classification
    )
    assert_not schedule.valid?
    assert(schedule.errors[:base].any? { |e| e.include?('mileage_interval') || e.include?('month_interval') })
  end

  test 'requires vehicle' do
    schedule = ServiceSchedule.new(
      classification: @classification,
      mileage_interval: 5000
    )
    assert_not schedule.valid?
  end

  test 'requires classification' do
    schedule = ServiceSchedule.new(
      vehicle: @vehicle,
      mileage_interval: 5000
    )
    assert_not schedule.valid?
  end

  test 'enabled defaults to true' do
    schedule = ServiceSchedule.new(
      vehicle: @vehicle,
      classification: @classification,
      mileage_interval: 5000
    )
    assert schedule.enabled
  end

  test 'has_one reminder association' do
    schedule = ServiceSchedule.create!(
      vehicle: @vehicle,
      classification: @classification,
      mileage_interval: 5000
    )
    reminder = Reminder.create!(
      vehicle: @vehicle,
      notes: @classification.name,
      service_schedule: schedule
    )
    assert_equal reminder, schedule.reminder
  end
end
