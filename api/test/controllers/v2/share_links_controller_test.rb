# frozen_string_literal: true

require 'test_helper'

module V2
  class ShareLinksControllerTest < ActionDispatch::IntegrationTest
    setup do
      new_session
      @vehicle = vehicles(:one)
    end

    test 'owner can create share link' do
      post vehicle_share_links_url(@vehicle), headers: http_options(@session.auth_token)[:headers], as: :json
      assert_response :created
      assert_not_nil response.parsed_body['token']
    end

    test 'non-owner cannot create share link' do
      other_user = users(:two)
      other_session = other_user.sessions.create!(
        auth_token: 'other-token',
        auth_token_valid_until: 1.day.from_now,
        last_seen: Time.zone.now
      )
      post vehicle_share_links_url(@vehicle), headers: http_options(other_session.auth_token)[:headers], as: :json
      assert_response :not_found
    end

    test 'owner can list share links' do
      ShareLink.create!(vehicle: @vehicle)
      get vehicle_share_links_url(@vehicle), headers: http_options(@session.auth_token)[:headers], as: :json
      assert_response :ok
      assert_equal 1, response.parsed_body.length
    end

    test 'owner can revoke share link' do
      link = ShareLink.create!(vehicle: @vehicle)
      delete vehicle_share_link_url(@vehicle, link), headers: http_options(@session.auth_token)[:headers]
      assert_response :no_content
      assert_not ShareLink.exists?(link.id)
    end

    test 'anyone can view vehicle by token' do
      link = ShareLink.create!(vehicle: @vehicle)
      get share_vehicle_url(link.token), as: :json
      assert_response :ok
      assert_equal @vehicle.id, response.parsed_body['id']
    end

    test 'returns 404 for invalid token' do
      get share_vehicle_url('invalid-token'), as: :json
      assert_response :not_found
    end

    test 'anyone can view records by token' do
      link = ShareLink.create!(vehicle: @vehicle)
      get share_vehicle_records_url(link.token), as: :json
      assert_response :ok
    end
  end
end
