# frozen_string_literal: true

require 'test_helper'

class RackAttackTest < ActionDispatch::IntegrationTest
  test 'POST /login is throttled after 10 requests per minute' do
    10.times do
      post '/login', params: { email: 'test@test', password: 'wrong' },
                     headers: { accept: 'application/json; version=2' }
    end

    post '/login', params: { email: 'test@test', password: 'wrong' },
                   headers: { accept: 'application/json; version=2' }
    assert_response :too_many_requests
  end

  test 'POST /password/reset is throttled after 5 requests per minute' do
    5.times do
      post '/password/reset', params: { email: 'test@test' },
                              headers: { accept: 'application/json; version=2' }
    end

    post '/password/reset', params: { email: 'test@test' },
                            headers: { accept: 'application/json; version=2' }
    assert_response :too_many_requests
  end

  test 'GET /login/:token is throttled after 10 requests per minute' do
    10.times do
      get '/login/some-token', headers: { accept: 'application/json; version=2' }
    end

    get '/login/some-token', headers: { accept: 'application/json; version=2' }
    assert_response :too_many_requests
  end

  test 'POST /sessions is throttled after 10 requests per minute' do
    10.times do
      post '/sessions', params: { email: 'test@test' },
                        headers: { accept: 'application/json; version=2' }
    end

    post '/sessions', params: { email: 'test@test' },
                      headers: { accept: 'application/json; version=2' }
    assert_response :too_many_requests
  end

  test 'throttle does not affect authenticated requests' do
    user = users(:one)
    session = user.sessions.create!(
      auth_token: 'test-throttle-token',
      auth_token_valid_until: 2.months.from_now,
      last_seen: Time.zone.now
    )

    # Exhaust the login throttle
    11.times do
      post '/login', params: { email: 'test@test', password: 'wrong' },
                     headers: { accept: 'application/json; version=2' }
    end

    # Authenticated request should still work
    get '/user', headers: http_options(session.auth_token)[:headers]
    assert_response :success
  end
end
