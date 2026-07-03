# frozen_string_literal: true

require 'test_helper'

module V2
  class SharesControllerTest < ActionDispatch::IntegrationTest
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

    test 'owner can create share invite' do
      post vehicle_shares_url(@vehicle), params: { email: @shared_user.email },
                                         headers: http_options(@session.auth_token)[:headers], as: :json
      assert_response :created
      assert_equal @shared_user.id, response.parsed_body['user_id']
      assert_nil response.parsed_body['accepted_at']
    end

    test 'returns error for non-existent email' do
      post vehicle_shares_url(@vehicle), params: { email: 'nobody@example.com' },
                                         headers: http_options(@session.auth_token)[:headers], as: :json
      assert_response :not_found
      assert_includes response.parsed_body['error'], 'No account found'
    end

    test 'returns error when sharing with self' do
      post vehicle_shares_url(@vehicle), params: { email: @owner.email },
                                         headers: http_options(@session.auth_token)[:headers], as: :json
      assert_response :unprocessable_entity
    end

    test 'non-owner cannot create share' do
      post vehicle_shares_url(@vehicle), params: { email: @shared_user.email },
                                         headers: http_options(@shared_session.auth_token)[:headers], as: :json
      assert_response :not_found
    end

    test 'owner can list shares' do
      VehicleShare.create!(vehicle: @vehicle, user: @shared_user, invited_by: @owner)
      get vehicle_shares_url(@vehicle), headers: http_options(@session.auth_token)[:headers], as: :json
      assert_response :ok
      assert_equal 1, response.parsed_body.length
      assert_equal @shared_user.id, response.parsed_body[0]['user_id']
    end

    test 'owner can revoke share' do
      share = VehicleShare.create!(vehicle: @vehicle, user: @shared_user, invited_by: @owner)
      delete vehicle_share_url(@vehicle, share), headers: http_options(@session.auth_token)[:headers]
      assert_response :no_content
      assert_not VehicleShare.exists?(share.id)
    end

    test 'non-owner cannot revoke share' do
      share = VehicleShare.create!(vehicle: @vehicle, user: @shared_user, invited_by: @owner)
      delete vehicle_share_url(@vehicle, share), headers: http_options(@shared_session.auth_token)[:headers]
      assert_response :not_found
    end

    test 'user can list pending invites' do
      VehicleShare.create!(vehicle: @vehicle, user: @shared_user, invited_by: @owner)
      get pending_shares_url, headers: http_options(@shared_session.auth_token)[:headers], as: :json
      assert_response :ok
      assert_equal 1, response.parsed_body.length
    end

    test 'user can accept invite' do
      share = VehicleShare.create!(vehicle: @vehicle, user: @shared_user, invited_by: @owner)
      post accept_share_url(share), headers: http_options(@shared_session.auth_token)[:headers]
      assert_response :ok
      assert_not_nil share.reload.accepted_at
    end

    test 'non-invitee cannot accept invite' do
      share = VehicleShare.create!(vehicle: @vehicle, user: @shared_user, invited_by: @owner)
      admin = users(:admin)
      admin_session = admin.sessions.create!(
        auth_token: 'admin-token',
        auth_token_valid_until: 1.day.from_now,
        last_seen: Time.zone.now
      )
      post accept_share_url(share), headers: http_options(admin_session.auth_token)[:headers]
      assert_response :not_found
    end

    test 'user can decline invite' do
      share = VehicleShare.create!(vehicle: @vehicle, user: @shared_user, invited_by: @owner)
      delete decline_share_url(share), headers: http_options(@shared_session.auth_token)[:headers]
      assert_response :no_content
      assert_not VehicleShare.exists?(share.id)
    end
  end
end
