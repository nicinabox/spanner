# frozen_string_literal: true

require 'test_helper'

class DefersControllerTest < ActionDispatch::IntegrationTest
  setup do
    new_session
    @vehicle = @user.vehicles.first
    @classification = Classification.create!(
      name: 'Oil Change',
      vehicle: @vehicle,
      keywords: ['oil change']
    )
  end

  test 'create defer sets defer_delta_months and recalculates' do
    schedule = ServiceSchedule.create!(
      vehicle: @vehicle,
      classification: @classification,
      month_interval: 6
    )
    schedule.recalculate_next_due

    post vehicle_service_schedule_defer_url(@vehicle, schedule),
         params: { months: 3 },
         headers: http_options(@session.auth_token)[:headers],
         as: :json

    assert_response :success
    schedule.reload
    assert_equal 3, schedule.defer_delta_months
  end

  test 'create defer sets defer_delta_miles and recalculates' do
    schedule = ServiceSchedule.create!(
      vehicle: @vehicle,
      classification: @classification,
      distance_interval: 5000
    )
    schedule.recalculate_next_due

    post vehicle_service_schedule_defer_url(@vehicle, schedule),
         params: { distance: 1000 },
         headers: http_options(@session.auth_token)[:headers],
         as: :json

    assert_response :success
    schedule.reload
    assert_equal 1000, schedule.defer_delta_miles
  end

  test 'create defer requires months or distance' do
    schedule = ServiceSchedule.create!(
      vehicle: @vehicle,
      classification: @classification,
      month_interval: 6
    )

    post vehicle_service_schedule_defer_url(@vehicle, schedule),
         params: {},
         headers: http_options(@session.auth_token)[:headers],
         as: :json

    assert_response :bad_request
  end

  test 'create defer with months rejects schedule without month_interval' do
    schedule = ServiceSchedule.create!(
      vehicle: @vehicle,
      classification: @classification,
      distance_interval: 5000
    )

    post vehicle_service_schedule_defer_url(@vehicle, schedule),
         params: { months: 3 },
         headers: http_options(@session.auth_token)[:headers],
         as: :json

    assert_response :bad_request
  end

  test 'create defer with distance rejects schedule without distance_interval' do
    schedule = ServiceSchedule.create!(
      vehicle: @vehicle,
      classification: @classification,
      month_interval: 6
    )

    post vehicle_service_schedule_defer_url(@vehicle, schedule),
         params: { distance: 1000 },
         headers: http_options(@session.auth_token)[:headers],
         as: :json

    assert_response :bad_request
  end

  test 'update defer modifies defer_delta_months' do
    schedule = ServiceSchedule.create!(
      vehicle: @vehicle,
      classification: @classification,
      month_interval: 6,
      defer_delta_months: 6
    )
    schedule.recalculate_next_due

    patch vehicle_service_schedule_defer_url(@vehicle, schedule),
          params: { months: 2 },
          headers: http_options(@session.auth_token)[:headers],
          as: :json

    assert_response :success
    schedule.reload
    assert_equal 2, schedule.defer_delta_months
  end

  test 'destroy defer clears deltas and recalculates' do
    schedule = ServiceSchedule.create!(
      vehicle: @vehicle,
      classification: @classification,
      distance_interval: 5000,
      defer_delta_miles: 1000
    )
    schedule.recalculate_next_due

    delete vehicle_service_schedule_defer_url(@vehicle, schedule),
           headers: http_options(@session.auth_token)[:headers]

    assert_response :success
    schedule.reload
    assert_nil schedule.defer_delta_miles
  end

  test 'defer returns schedule in response' do
    schedule = ServiceSchedule.create!(
      vehicle: @vehicle,
      classification: @classification,
      month_interval: 6
    )

    post vehicle_service_schedule_defer_url(@vehicle, schedule),
         params: { months: 3 },
         headers: http_options(@session.auth_token)[:headers],
         as: :json

    assert_response :success
    body = response_body
    assert body['id']
    assert body['deferred']
    assert_equal 3, body['defer_delta_months']
  end
end