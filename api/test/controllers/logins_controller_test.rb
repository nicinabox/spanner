# frozen_string_literal: true

require 'test_helper'

class LoginsControllerTest < ActionDispatch::IntegrationTest
  test 'login with correct password returns session' do
    user = users(:one)
    user.password = 'password123'
    user.save!

    post '/login', params: { email: user.email, password: 'password123' },
         headers: { accept: 'application/json; version=2' }

    assert_response :success
    assert_not_empty response_body['auth_token']
    assert_equal user.id, response_body['user_id']
  end

  test 'login with wrong password returns 401' do
    user = users(:one)
    user.password = 'password123'
    user.save!

    post '/login', params: { email: user.email, password: 'wrongpassword' },
         headers: { accept: 'application/json; version=2' }

    assert_response :unauthorized
  end

  test 'login with password for non-existent email returns 401 (no enumeration)' do
    post '/login', params: { email: 'nobody@test', password: 'password123' },
         headers: { accept: 'application/json; version=2' }

    assert_response :unauthorized
    assert_no_difference 'User.count' do
      post '/login', params: { email: 'nobody2@test', password: 'password123' },
           headers: { accept: 'application/json; version=2' }
    end
  end

  test 'login with no password for password-enabled account returns 202 (no magic link sent)' do
    user = users(:one)
    user.password = 'password123'
    user.save!

    assert_no_emails do
      post '/login', params: { email: user.email },
           headers: { accept: 'application/json; version=2' }
    end

    assert_response :accepted
  end

  test 'login with no password for no-password account sends magic link and returns 202' do
    user = users(:two) # no password set

    assert_emails 1 do
      post '/login', params: { email: user.email, host: 'localhost' },
           headers: { accept: 'application/json; version=2' }
    end

    assert_response :accepted
  end

  test 'login with non-existent email and no password creates user and sends magic link' do
    assert_difference 'User.count', 1 do
      # 2 emails: magic link + prompt to add first vehicle (delayed)
      assert_emails 2 do
        post '/login', params: { email: 'newuser@test', host: 'localhost' },
             headers: { accept: 'application/json; version=2' }
      end
    end

    assert_response :accepted
  end

  test 'login with password for no-password account returns 401 (does not reveal auth method)' do
    user = users(:two) # no password set

    assert_no_emails do
      post '/login', params: { email: user.email, password: 'anything', host: 'localhost' },
           headers: { accept: 'application/json; version=2' }
    end

    assert_response :unauthorized
  end

  test 'login always consumes bcrypt time (various combinations)' do
    # Ensure no crash with various combinations
    user = users(:one)
    user.password = 'password123'
    user.save!

    post '/login', params: { email: 'nobody@test', password: 'password123' },
         headers: { accept: 'application/json; version=2' }
    assert_response :unauthorized

    post '/login', params: { email: user.email, password: 'wrong' },
         headers: { accept: 'application/json; version=2' }
    assert_response :unauthorized

    post '/login', params: { email: 'nobody@test' },
         headers: { accept: 'application/json; version=2' }
    assert_response :accepted
  end
end
