# frozen_string_literal: true

require 'test_helper'

class ClassifyControllerTest < ActionDispatch::IntegrationTest
  setup do
    new_session
  end

  test 'classify returns results for matching notes' do
    get classify_vehicles_url, params: { notes: 'oil change' },
                               headers: http_options(@session.auth_token)[:headers]

    assert_response :success
    body = response_body
    assert body.is_a?(Array)
    assert(body.any? { |r| r['classification']['name'] == 'Oil Change' })
  end

  test 'classify returns confidence scores' do
    get classify_vehicles_url, params: { notes: 'oil change' },
                               headers: http_options(@session.auth_token)[:headers]

    assert_response :success
    body = response_body
    result = body.find { |r| r['classification']['name'] == 'Oil Change' }
    assert_not_nil result
    assert result['confidence'].is_a?(Float)
    assert result['confidence'].positive?
    assert result['confidence'] <= 1.0
    assert_equal 'heuristic', result['classifier']
  end

  test 'classify returns empty array for unrecognized notes' do
    get classify_vehicles_url, params: { notes: 'washed and waxed' },
                               headers: http_options(@session.auth_token)[:headers]

    assert_response :success
    assert_equal [], response_body
  end

  test 'classify returns empty array for blank notes' do
    get classify_vehicles_url, params: { notes: '' },
                               headers: http_options(@session.auth_token)[:headers]

    assert_response :success
    assert_equal [], response_body
  end

  test 'classify returns multiple results for multi-service notes' do
    get classify_vehicles_url, params: { notes: 'oil change and tire rotation' },
                               headers: http_options(@session.auth_token)[:headers]

    assert_response :success
    names = response_body.map { |r| r['classification']['name'] }
    assert_includes names, 'Oil Change'
    assert_includes names, 'Tire Rotation'
  end

  test 'classify includes classification details' do
    get classify_vehicles_url, params: { notes: 'oil change' },
                               headers: http_options(@session.auth_token)[:headers]

    assert_response :success
    result = response_body.first
    assert_not_nil result['classification']
    assert result['classification']['id'].is_a?(Integer)
    assert result['classification']['name'].is_a?(String)
    assert result['classification']['key'].is_a?(String)
  end
end
