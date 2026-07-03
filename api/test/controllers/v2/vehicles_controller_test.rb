# frozen_string_literal: true

require 'test_helper'

module V2
  class VehiclesControllerTest < ActionDispatch::IntegrationTest
    setup do
      new_session
      @owner = @user
      @shared_user = users(:two)
      @vehicle = vehicles(:one)
      @shared_session = @shared_user.sessions.create!(
        auth_token: 'shared-token',
        auth_token_valid_until: 1.day.from_now,
        last_seen: Time.zone.now
      )
    end

    test 'shared user sees vehicle in list' do
      share = VehicleShare.create!(vehicle: @vehicle, user: @shared_user, invited_by: @owner)
      share.accept!

      get vehicles_url, headers: http_options(@shared_session.auth_token)[:headers], as: :json
      assert_response :ok
      ids = response.parsed_body.pluck('id')
      assert_includes ids, @vehicle.id
    end

    test 'shared user sees isShared flag' do
      share = VehicleShare.create!(vehicle: @vehicle, user: @shared_user, invited_by: @owner)
      share.accept!

      get vehicles_url, headers: http_options(@shared_session.auth_token)[:headers], as: :json
      vehicle_json = response.parsed_body.find { |v| v['id'] == @vehicle.id }
      assert vehicle_json['is_shared']
    end

    test 'owner does not see isShared flag' do
      get vehicles_url, headers: http_options(@session.auth_token)[:headers], as: :json
      vehicle_json = response.parsed_body.find { |v| v['id'] == @vehicle.id }
      assert_not vehicle_json['is_shared']
    end

    test 'shared user cannot update vehicle' do
      put vehicle_url(@vehicle), params: { vehicle: { name: 'Hacked' } },
                                 headers: http_options(@shared_session.auth_token)[:headers], as: :json
      assert_response :not_found
    end

    test 'shared user cannot delete vehicle' do
      delete vehicle_url(@vehicle), headers: http_options(@shared_session.auth_token)[:headers]
      assert_response :not_found
    end

    test 'shared user can create record' do
      share = VehicleShare.create!(vehicle: @vehicle, user: @shared_user, invited_by: @owner)
      share.accept!

      post vehicle_records_url(@vehicle), params: {
        record: { date: '2024-01-15', mileage: 50_000, notes: 'Oil change' }
      }, headers: http_options(@shared_session.auth_token)[:headers], as: :json
      assert_response :success
    end

    test 'pending share does not grant access' do
      VehicleShare.create!(vehicle: @vehicle, user: @shared_user, invited_by: @owner)

      get vehicles_url, headers: http_options(@shared_session.auth_token)[:headers], as: :json
      ids = response.parsed_body.pluck('id')
      assert_not_includes ids, @vehicle.id
    end
  end
end
