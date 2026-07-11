# frozen_string_literal: true

require 'test_helper'

class ServiceScheduleTest < ActiveSupport::TestCase
  setup do
    @user = User.first
    @vehicle = @user.vehicles.first
    @classification = Classification.create!(
      name: 'Oil Change',
      vehicle: @vehicle,
      keywords: ['oil change', 'engine oil', 'motor oil', 'oil filter'],
      system: false
    )
  end

  test 'valid with distance_interval' do
    schedule = ServiceSchedule.new(
      vehicle: @vehicle,
      classification: @classification,
      distance_interval: 5000
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
      distance_interval: 5000,
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
    assert(schedule.errors[:base].any? { |e| e.include?('distance_interval') || e.include?('month_interval') })
  end

  test 'requires vehicle' do
    schedule = ServiceSchedule.new(
      classification: @classification,
      distance_interval: 5000
    )
    assert_not schedule.valid?
  end

  test 'requires classification' do
    schedule = ServiceSchedule.new(
      vehicle: @vehicle,
      distance_interval: 5000
    )
    assert_not schedule.valid?
  end

  test 'enabled defaults to true' do
    schedule = ServiceSchedule.new(
      vehicle: @vehicle,
      classification: @classification,
      distance_interval: 5000
    )
    assert schedule.enabled
  end

  test 'recalculate_next_due from mileage interval with matching record' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    record = vehicle.records.create!(
      date: 30.days.ago,
      notes: 'Oil change',
      mileage: 50_000
    )
    record.record_classifications.create!(classification: @classification, classifier: 'test')

    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: @classification,
      distance_interval: 5000
    )
    schedule.recalculate_next_due

    assert schedule.reload.next_due_mileage.present?
    assert_equal 55_000, schedule.reload.next_due_mileage
  end

  test 'recalculate_next_due from mileage interval with no matching record uses estimated mileage' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)

    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: @classification,
      distance_interval: 5000
    )
    schedule.recalculate_next_due

    assert schedule.reload.next_due_mileage.present?
  end

  test 'recalculate_next_due from month interval with matching record' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    record = vehicle.records.create!(
      date: 30.days.ago,
      notes: 'Oil change',
      mileage: 50_000
    )
    record.record_classifications.create!(classification: @classification, classifier: 'test')

    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: @classification,
      month_interval: 6
    )
    schedule.recalculate_next_due

    assert schedule.reload.next_due_date.present?
    assert_equal 30.days.ago.to_date + 6.months, schedule.reload.next_due_date
  end

  test 'recalculate_next_due with both intervals sets both next_due fields' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    record = vehicle.records.create!(
      date: 30.days.ago,
      notes: 'Oil change',
      mileage: 50_000
    )
    record.record_classifications.create!(classification: @classification, classifier: 'test')

    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: @classification,
      distance_interval: 5000,
      month_interval: 12
    )
    schedule.recalculate_next_due

    assert schedule.reload.next_due_mileage.present?
    assert_equal 55_000, schedule.reload.next_due_mileage
    # miles_per_day is 0 for a vehicle with a single record, so estimated_next_date is nil
    # and the month-based date is used
    assert_equal 30.days.ago.to_date + 12.months, schedule.reload.next_due_date
  end

  test 'recalculate_next_due with both intervals uses mileage date when sooner' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    # Two records to establish miles_per_day
    vehicle.records.create!(date: 100.days.ago, notes: 'Purchase', mileage: 40_000)
    record = vehicle.records.create!(date: 10.days.ago, notes: 'Oil change', mileage: 50_000)
    record.record_classifications.create!(classification: @classification, classifier: 'test')

    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: @classification,
      distance_interval: 5000,
      month_interval: 12
    )
    schedule.recalculate_next_due
    schedule.reload

    assert_equal 55_000, schedule.next_due_mileage

    date_from_months = 10.days.ago.to_date + 12.months
    assert schedule.next_due_date < date_from_months,
           "expected mileage date #{schedule.next_due_date} to be sooner than month date #{date_from_months}"
  end

  test 'recalculate_next_due with both intervals uses month date when mileage date is nil' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    record = vehicle.records.create!(date: 30.days.ago, notes: 'Oil change', mileage: 50_000)
    record.record_classifications.create!(classification: @classification, classifier: 'test')

    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: @classification,
      distance_interval: 5000,
      month_interval: 6
    )
    schedule.recalculate_next_due
    schedule.reload

    # miles_per_day is 0, so estimated_next_date returns nil and month date is used
    assert_equal 30.days.ago.to_date + 6.months, schedule.next_due_date
  end

  test 'recalculate_next_due with both intervals uses month date when mileage date is later' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    # Two records to establish miles_per_day
    vehicle.records.create!(date: 100.days.ago, notes: 'Purchase', mileage: 40_000)
    record = vehicle.records.create!(date: 10.days.ago, notes: 'Oil change', mileage: 50_000)
    record.record_classifications.create!(classification: @classification, classifier: 'test')

    # Large distance interval so mileage date is far in the future, short month interval
    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: @classification,
      distance_interval: 100_000,
      month_interval: 3
    )
    schedule.recalculate_next_due
    schedule.reload

    date_from_months = 10.days.ago.to_date + 3.months
    assert_equal date_from_months, schedule.next_due_date,
                 "expected month date #{date_from_months} to be used, got #{schedule.next_due_date}"
  end

  test 'recalculate_next_due updates next_due_mileage after new matching record' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    classification = Classification.create!(
      name: 'Oil Change',
      vehicle: vehicle,
      keywords: ['oil change', 'engine oil', 'motor oil', 'oil filter'],
      system: false
    )
    vehicle.records.create!(
      date: 30.days.ago,
      notes: 'Oil change',
      mileage: 50_000
    )

    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: classification,
      distance_interval: 5000
    )
    schedule.recalculate_next_due

    vehicle.records.create!(
      date: Time.zone.today,
      notes: 'Oil change',
      mileage: 53_000
    )
    schedule.recalculate_next_due

    assert_equal 58_000, schedule.reload.next_due_mileage
  end

  test 'recalculate_next_due when disabled clears next_due fields' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: @classification,
      distance_interval: 5000
    )
    schedule.recalculate_next_due
    assert schedule.reload.next_due_mileage.present?

    schedule.update!(enabled: false)
    schedule.recalculate_next_due

    assert_nil schedule.reload.next_due_date
    assert_nil schedule.reload.next_due_mileage
  end

  test 'complete! creates a record and advances next_due' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    vehicle.records.create!(
      date: 30.days.ago,
      notes: 'Oil change',
      mileage: 50_000
    )

    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: @classification,
      distance_interval: 5000
    )
    schedule.recalculate_next_due

    assert_difference -> { vehicle.records.count }, 1 do
      schedule.complete!
    end

    last_record = vehicle.records.reorder(date: :desc).first
    assert_equal @classification.name, last_record.notes
    assert_equal last_record.id, schedule.reload.last_completed_record_id
    assert_equal 55_000, schedule.reload.next_due_mileage
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
      distance_interval: 5000
    )
    schedule.recalculate_next_due

    schedule.complete!(notes: 'Synthetic oil change', date: 3.days.ago, mileage: 52_000)

    last_record = vehicle.records.reorder(date: :desc).first
    assert_equal 'Synthetic oil change', last_record.notes
    assert_equal 3.days.ago.to_date, last_record.date.to_date
    assert_equal 52_000, last_record.mileage
    assert_equal 57_000, schedule.reload.next_due_mileage
  end

  test 'complete! defaults mileage to estimated mileage' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: @classification,
      month_interval: 12
    )
    schedule.recalculate_next_due

    schedule.complete!

    last_record = vehicle.records.reorder(date: :desc).first
    assert last_record.date.present?
  end

  test 'auto-advances schedule when matching record is saved' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    classification = Classification.create!(
      name: 'Oil Change',
      vehicle: vehicle,
      keywords: ['oil change', 'engine oil', 'motor oil', 'oil filter'],
      system: false
    )
    record = vehicle.records.create!(
      date: 60.days.ago,
      notes: 'Oil change',
      mileage: 50_000
    )
    record.record_classifications.create!(classification: classification, classifier: 'test')

    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: classification,
      distance_interval: 5000
    )
    schedule.recalculate_next_due
    assert_equal 55_000, schedule.reload.next_due_mileage

    vehicle.records.create!(
      date: Time.zone.today,
      notes: 'Oil change',
      mileage: 53_000
    )

    schedule.reload
    assert_equal 58_000, schedule.reload.next_due_mileage
  end

  test 'does not advance schedules when record does not match classification' do
    vehicle = Vehicle.create!(name: 'Test Car', user: @user)
    vehicle.records.create!(
      date: 60.days.ago,
      notes: 'Oil change',
      mileage: 50_000
    )

    schedule = ServiceSchedule.create!(
      vehicle: vehicle,
      classification: @classification,
      distance_interval: 5000
    )
    schedule.recalculate_next_due
    original_mileage = schedule.reload.next_due_mileage

    vehicle.records.create!(
      date: Time.zone.today,
      notes: 'Washed car',
      mileage: 51_000
    )

    schedule.reload
    assert_equal original_mileage, schedule.reload.next_due_mileage
  end
end
