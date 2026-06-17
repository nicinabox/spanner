# frozen_string_literal: true

require 'test_helper'

class ClassificationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(email: 'classifications_test@example.com')
    @session = @user.sessions.create!(
      auth_token: 'classificationstoken123',
      auth_token_valid_until: 1.day.from_now,
      last_seen: Time.zone.now
    )
    @headers = {
      accept: 'application/json; version=2',
      authorization: "Token #{@session.auth_token}"
    }
  end

  test 'returns system classifications' do
    get classifications_url, headers: @headers
    assert_response :success
    body = JSON.parse(@response.body)
    assert body.is_a?(Array)
    assert(body.any? { |c| c['key'] == 'oil_change' })
  end
end
