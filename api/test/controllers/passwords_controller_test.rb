# frozen_string_literal: true

require 'test_helper'

class PasswordsControllerTest < ActionDispatch::IntegrationTest
  test 'set password when authenticated and no existing password' do
    user = users(:one)
    user.update!(password_digest: nil)
    session = user.sessions.create!(
      auth_token: 'test-token-set',
      auth_token_valid_until: 2.months.from_now,
      last_seen: Time.zone.now
    )

    put '/password', params: { password: 'newpassword123' },
        headers: http_options(session.auth_token)[:headers]

    assert_response :success
    assert user.reload.authenticate('newpassword123')
  end

  test 'change password does not require current_password' do
    user = users(:one)
    user.password = 'oldpassword123'
    user.save!
    session = user.sessions.create!(
      auth_token: 'test-token-change',
      auth_token_valid_until: 2.months.from_now,
      last_seen: Time.zone.now
    )

    put '/password', params: { password: 'newpassword456' },
        headers: http_options(session.auth_token)[:headers]

    assert_response :success
    assert user.reload.authenticate('newpassword456')
    assert_not user.authenticate('oldpassword123')
  end

  test 'request reset always returns 202' do
    post '/password/reset', params: { email: 'nobody@test' },
         headers: { accept: 'application/json; version=2' }
    assert_response :accepted

    user = users(:one)
    user.password = 'password123'
    user.save!

    assert_emails 1 do
      post '/password/reset', params: { email: user.email },
           headers: { accept: 'application/json; version=2' }
    end
    assert_response :accepted
  end

  test 'request reset for no-password account does not send email' do
    user = users(:two) # no password

    assert_no_emails do
      post '/password/reset', params: { email: user.email },
           headers: { accept: 'application/json; version=2' }
    end
    assert_response :accepted
  end

  test 'reset with valid token sets password and creates session' do
    user = users(:one)
    user.password = 'oldpassword123'
    user.save!

    # Generate a password reset token using the built-in mechanism
    token = user.password_reset_token

    post "/password/reset/#{token}", params: { password: 'newpassword456' },
         headers: { accept: 'application/json; version=2' }

    assert_response :success
    assert_not_empty response_body['auth_token']
    assert user.reload.authenticate('newpassword456')
  end

  test 'reset with invalid token returns 401' do
    post '/password/reset/nonexistent-token', params: { password: 'newpassword456' },
         headers: { accept: 'application/json; version=2' }

    assert_response :unauthorized
  end

  test 'unauthenticated set password returns 401' do
    put '/password', params: { password: 'newpassword123' },
        headers: { accept: 'application/json; version=2' }
    assert_response :unauthorized
  end

  test 'password too short returns 422' do
    user = users(:one)
    user.update!(password_digest: nil)
    session = user.sessions.create!(
      auth_token: 'test-token-short',
      auth_token_valid_until: 2.months.from_now,
      last_seen: Time.zone.now
    )

    put '/password', params: { password: 'short' },
        headers: http_options(session.auth_token)[:headers]

    assert_response :unprocessable_content
  end
end
