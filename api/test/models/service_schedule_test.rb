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

  test 'generate_reminder from month interval with matching record' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    vehicle.records.create!(
      date: 30.days.ago,
      notes: 'Oil change',
      mileage: 50_000
    )

    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: @classification,
      month_interval: 6
    )
    schedule.generate_reminder

    assert schedule.reminder.present?
    assert_equal 'date', schedule.reminder.reminder_type
    assert_equal 30.days.ago.to_date + 6.months, schedule.reminder.date.to_date
  end

  test 'generate_reminder with both intervals creates date_or_mileage reminder' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    vehicle.records.create!(
      date: 30.days.ago,
      notes: 'Oil change',
      mileage: 50_000
    )

    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: @classification,
      mileage_interval: 5000,
      month_interval: 12
    )
    schedule.generate_reminder

    assert schedule.reminder.present?
    assert_equal 'date_or_mileage', schedule.reminder.reminder_type
    assert_equal 55_000, schedule.reminder.mileage
    assert_equal 30.days.ago.to_date + 12.months, schedule.reminder.date.to_date
  end

  test 'generate_reminder updates existing reminder instead of creating duplicate' do
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
    original_reminder_id = schedule.reminder.id

    vehicle.records.create!(
      date: Time.zone.today,
      notes: 'Oil change',
      mileage: 53_000
    )
    schedule.generate_reminder

    assert_equal original_reminder_id, schedule.reminder.id
    assert_equal 58_000, schedule.reminder.mileage
  end

  test 'generate_reminder when disabled destroys existing reminder' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: @classification,
      mileage_interval: 5000
    )
    schedule.generate_reminder
    assert schedule.reminder.present?

    schedule.update!(enabled: false)
    schedule.generate_reminder

    assert_nil schedule.reminder
  end

  test 'complete! creates a record and advances reminder' do
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

    assert_difference -> { vehicle.records.count }, 1 do
      schedule.complete!
    end

    last_record = vehicle.records.reorder(date: :desc).first
    assert_equal @classification.name, last_record.notes
    assert_equal last_record.id, schedule.reload.last_completed_record_id
    assert_equal 55_000, schedule.reminder.mileage
  end

  test 'complete! with override params' do
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

    schedule.complete!(notes: 'Synthetic oil change', date: 3.days.ago, mileage: 52_000)

    last_record = vehicle.records.reorder(date: :desc).first
    assert_equal 'Synthetic oil change', last_record.notes
    assert_equal 3.days.ago.to_date, last_record.date.to_date
    assert_equal 52_000, last_record.mileage
    assert_equal 57_000, schedule.reminder.mileage
  end

  test 'complete! defaults mileage to estimated mileage' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: @classification,
      month_interval: 12
    )
    schedule.generate_reminder

    schedule.complete!

    last_record = vehicle.records.reorder(date: :desc).first
    assert last_record.date.present?
  end

  test 'auto-creates schedules from classification defaults on vehicle creation' do
    @classification.update!(default_mileage_interval: 5000)

    vehicle = Vehicle.create!(name: 'New Car', user: @user)

    schedules = vehicle.service_schedules
    assert schedules.any? { |s| s.classification_id == @classification.id }
    oil_schedule = schedules.find { |s| s.classification_id == @classification.id }
    assert_equal 5000, oil_schedule.mileage_interval
  end

  test 'does not auto-create schedules for classifications without default intervals' do
    Classification.find_by!(key: 'tire_rotation').update!(
      default_mileage_interval: nil,
      default_month_interval: nil
    )

    vehicle = Vehicle.create!(name: 'New Car', user: @user)

    schedules = vehicle.service_schedules
    assert_not schedules.any? { |s| s.classification.key == 'tire_rotation' }
  end

  test 'auto-advances schedule when matching record is saved' do
    @classification.update!(default_mileage_interval: 5000)
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    vehicle.records.create!(
      date: 60.days.ago,
      notes: 'Oil change',
      mileage: 50_000
    )

    schedule = vehicle.service_schedules.find { |s| s.classification_id == @classification.id }
    schedule.generate_reminder
    assert_equal 55_000, schedule.reminder.mileage

    vehicle.records.create!(
      date: Time.zone.today,
      notes: 'Oil change',
      mileage: 53_000
    )

    schedule.reload
    assert_equal 58_000, schedule.reminder.mileage
  end

  test 'does not advance schedules when record does not match classification' do
    @classification.update!(default_mileage_interval: 5000)
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    vehicle.records.create!(
      date: 60.days.ago,
      notes: 'Oil change',
      mileage: 50_000
    )

    schedule = vehicle.service_schedules.find { |s| s.classification_id == @classification.id }
    schedule.generate_reminder
    original_mileage = schedule.reminder.mileage

    vehicle.records.create!(
      date: Time.zone.today,
      notes: 'Washed car',
      mileage: 51_000
    )

    schedule.reload
    assert_equal original_mileage, schedule.reminder.mileage
  end
end
