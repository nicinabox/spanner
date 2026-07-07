# frozen_string_literal: true

require 'test_helper'

class ServiceSchedulePresetsControllerTest < ActionDispatch::IntegrationTest
  test 'presets returns known groups' do
    new_session
    get service_schedules_presets_url,
        headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    body = response_body
    assert_includes body.keys, 'car'
    assert_includes body.keys, 'boat'
    assert body['car'].is_a?(Hash)
    assert body['car'].key?('name')
    assert body['car'].key?('distance_unit')
    assert body['car'].key?('items')
    assert body['car']['items'].is_a?(Array)
    assert body['car']['items'].first.key?('name')
    assert body['car']['items'].first.key?('intervals')
    assert body['car']['items'].first.key?('keywords')
  end

  test 'filters by mi returns car, motorcycle, rv' do
    new_session
    get service_schedules_presets_url,
        params: { distance_unit: 'mi' },
        headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    assert_equal %w[car motorcycle rv], response_body.keys.sort
  end

  test 'filters by km returns car, motorcycle' do
    new_session
    get service_schedules_presets_url,
        params: { distance_unit: 'km' },
        headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    assert_equal %w[car motorcycle], response_body.keys.sort
  end

  test 'filters by nmi returns boat' do
    new_session
    get service_schedules_presets_url,
        params: { distance_unit: 'nmi' },
        headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    assert_equal %w[boat], response_body.keys
  end

  test 'filters by unknown unit returns empty' do
    new_session
    get service_schedules_presets_url,
        params: { distance_unit: 'hr' },
        headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    assert_equal({}, response_body)
  end

  test 'without filter returns all groups' do
    new_session
    get service_schedules_presets_url,
        headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    assert_equal %w[boat car motorcycle rv], response_body.keys.sort
  end
end
