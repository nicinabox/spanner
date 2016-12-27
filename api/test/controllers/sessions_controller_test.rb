require 'test_helper'

class SessionsControllerTest < ActionDispatch::IntegrationTest
  test "request new session" do
    post sessions_url, http_options.merge({
      params: {
        email: 'nic@test'
      }
    })
    assert User.last.email == 'nic@test'
    assert User.last.login_token_valid_until > Time.now
  end

  test "login" do
    login_token = SecureRandom.urlsafe_base64
    User.create({
      email: 'nic@test',
      login_token: login_token,
      login_token_valid_until: Time.now + 15.minutes
    })

    get login_url(login_token: login_token), http_options
    assert_not_empty response_body['auth_token']
  end
end
