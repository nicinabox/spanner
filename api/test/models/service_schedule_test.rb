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

  test 'generate_reminder from mileage interval with matching record' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    vehicle.records.create!(
      date: 30.days.ago,
      notes: 'Oil change',
      mileage: 50_000
    )

    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: @classification,
      mileage_interval: 5000
    )
    schedule.generate_reminder

    assert schedule.reminder.present?
    assert_equal 55_000, schedule.reminder.mileage
    assert_equal 'mileage', schedule.reminder.reminder_type
    assert_equal schedule, schedule.reminder.service_schedule
  end

  test 'generate_reminder from mileage interval with no matching record uses estimated mileage' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)

    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: @classification,
      mileage_interval: 5000
    )
    schedule.generate_reminder

    assert schedule.reminder.present?
    assert_equal 'mileage', schedule.reminder.reminder_type
  end
end
