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
    assert body['car']['items'].first.key?('distance_interval')
    assert body['car']['items'].first.key?('month_interval')
  end
end
