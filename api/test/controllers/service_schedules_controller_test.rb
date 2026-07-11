# frozen_string_literal: true

require 'test_helper'

class ServiceSchedulesControllerTest < ActionDispatch::IntegrationTest
  setup do
    new_session
    @vehicle = @user.vehicles.first
    @oil = Classification.create!(
      name: 'Oil Change',
      vehicle: @vehicle,
      keywords: ['oil change', 'engine oil', 'motor oil', 'oil filter']
    )
    @tire = Classification.create!(
      name: 'Tire Rotation',
      vehicle: @vehicle,
      keywords: ['tire rotation', 'rotate tires', 'rotate tyres']
    )
    @schedule = ServiceSchedule.create!(
      vehicle: @vehicle,
      classification: @oil,
      distance_interval: 5000
    )
  end

  test 'index returns schedules for vehicle' do
    get vehicle_service_schedules_url(@vehicle), headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    schedules = response_body
    assert(schedules.any? { |s| s['id'] == @schedule.id })
  end

  test 'show returns a single schedule' do
    get vehicle_service_schedule_url(@vehicle, @schedule), headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    assert_equal @schedule.id, response_body['id']
    assert_equal 5000, response_body['distance_interval']
  end

  test 'create creates a schedule and recalculates next due' do
    assert_difference -> { ServiceSchedule.count }, 1 do
      post vehicle_service_schedules_url(@vehicle),
           params: { service_schedule: {
             classification_id: @tire.id,
             distance_interval: 7500
           } },
           headers: http_options(@session.auth_token)[:headers]
    end
    assert_response :success

    schedule = ServiceSchedule.find(response_body['id'])
    assert_equal 7500, schedule.distance_interval
    assert schedule.reload.next_due_mileage.present?
  end

  test 'update modifies a schedule and recalculates next due' do
    put vehicle_service_schedule_url(@vehicle, @schedule),
        params: { service_schedule: { distance_interval: 7500 } },
        headers: http_options(@session.auth_token)[:headers]
    assert_response :success

    @schedule.reload
    assert_equal 7500, @schedule.distance_interval
  end

  test 'destroy removes schedule' do
    delete vehicle_service_schedule_url(@vehicle, @schedule),
           headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    assert_not ServiceSchedule.exists?(@schedule.id)
  end

  test 'complete creates a record and advances schedule' do
    @schedule.recalculate_next_due

    assert_difference -> { @vehicle.records.count }, 1 do
      post complete_vehicle_service_schedule_url(@vehicle, @schedule),
           params: { notes: 'Synthetic oil', mileage: 52_000 },
           headers: http_options(@session.auth_token)[:headers]
    end
    assert_response :success

    @schedule.reload
    assert_equal 57_000, @schedule.reload.next_due_mileage
  end

  test 'complete with no overrides uses defaults' do
    @schedule.recalculate_next_due

    post complete_vehicle_service_schedule_url(@vehicle, @schedule),
         headers: http_options(@session.auth_token)[:headers]
    assert_response :success

    @schedule.reload
    assert @schedule.last_completed_record_id.present?
  end

  test 'create rejects duplicate classification for vehicle' do
    post vehicle_service_schedules_url(@vehicle),
         params: { service_schedule: {
           classification_id: @oil.id,
           distance_interval: 3000
         } },
         headers: http_options(@session.auth_token)[:headers]
    assert_response :unprocessable_entity
  end

  test 'create tags matching records with classification' do
    record = @vehicle.records.create!(date: 1.day.ago, notes: 'Got a tire rotation today', mileage: 50_000)

    post vehicle_service_schedules_url(@vehicle),
         params: { service_schedule: {
           classification_id: @tire.id,
           distance_interval: 7500
         } },
         headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    assert_includes record.reload.classifications, @tire
  end
end
