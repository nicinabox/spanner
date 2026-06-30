# frozen_string_literal: true

require 'test_helper'

class SessionsControllerTest < ActionDispatch::IntegrationTest
  test 'request new session' do
    post sessions_url, params: { email: 'nic@test' }, headers: http_options[:headers]
    assert User.last.email == 'nic@test'
    assert User.last.login_token_valid_until > Time.zone.now
  end

  test 'login' do
    login_token = SecureRandom.urlsafe_base64
    User.create({
                  email: 'nic@test',
                  login_token: login_token,
                  login_token_valid_until: 15.minutes.from_now
                })

    get login_url(login_token: login_token), headers: http_options[:headers]
    assert_not_empty response_body['auth_token']
  end

  test 'magic link works for password-enabled accounts' do
    user = User.create!(
      email: 'pwduser@test',
      password: 'password123',
      login_token: SecureRandom.urlsafe_base64,
      login_token_valid_until: 15.minutes.from_now
    )

    get login_url(login_token: user.reload.login_token), headers: http_options[:headers]
    assert_not_empty response_body['auth_token']
  end
end
