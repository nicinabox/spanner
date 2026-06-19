# frozen_string_literal: true

require 'test_helper'

module V2
  class UsersControllerTest < ActionDispatch::IntegrationTest
    setup do
      @user = User.create!(email: 'testuser@example.com')
      @session = @user.sessions.create!(
        auth_token: 'testtoken123',
        auth_token_valid_until: 1.day.from_now,
        last_seen: Time.zone.now
      )
      @headers = {
        accept: 'application/json; version=2',
        authorization: "Token #{@session.auth_token}"
      }
    end

    test 'should get current user' do
      get user_url, headers: @headers
      assert_response :success
      body = JSON.parse(@response.body)
      assert_equal @user.email, body['email']
      assert_equal false, body['admin?']
    end

    test 'should update current user' do
      put user_url, params: { user: { time_zone_offset: '-5' } }, headers: @headers
      assert_response :success
      @user.reload
      assert_equal '-5', @user.time_zone_offset
    end

    test 'should not change email via update' do
      put user_url, params: { user: { email: 'updated@example.com' } }, headers: @headers
      assert_response :success
      @user.reload
      assert_equal 'testuser@example.com', @user.email
    end

    test 'should not update user with invalid params' do
      put user_url, params: { user: { email: '' } }, headers: @headers
      # `email` is now ignored by user_params, so the update succeeds and
      # email is unchanged.
      assert_response :success
      @user.reload
      assert_equal 'testuser@example.com', @user.email
    end

    test 'should request email change' do
      perform_enqueued_jobs do
        assert_emails 2 do
          post email_change_user_url,
               params: { user: { email: 'new@example.com' }, host: 'http://localhost:8080' },
               headers: @headers
        end
      end
      assert_response :no_content

      @user.reload
      assert_equal 'testuser@example.com', @user.email
      assert_equal 'new@example.com', @user.unconfirmed_email
      assert_not_nil @user.email_confirmation_token
      assert @user.email_confirmation_token_valid_until > Time.zone.now
    end

    test 'should not request email change to a duplicate email' do
      User.create!(email: 'taken@example.com')

      post email_change_user_url,
           params: { user: { email: 'taken@example.com' }, host: 'http://localhost:8080' },
           headers: @headers
      assert_response :unprocessable_entity

      @user.reload
      assert_nil @user.unconfirmed_email
    end

    test 'should not request email change without email' do
      post email_change_user_url,
           params: { user: { email: '' }, host: 'http://localhost:8080' },
           headers: @headers
      assert_response :unprocessable_entity
    end

    test 'should not request email change to the same email' do
      post email_change_user_url,
           params: { user: { email: 'testuser@example.com' }, host: 'http://localhost:8080' },
           headers: @headers
      assert_response :unprocessable_entity
    end

    test 'should confirm email change with a valid token' do
      @user.request_email_change!('new@example.com')
      token = @user.reload.email_confirmation_token

      get confirm_email_url(token)
      assert_response :success

      @user.reload
      assert_equal 'new@example.com', @user.email
      assert_nil @user.unconfirmed_email
      assert_nil @user.email_confirmation_token
    end

    test 'should not confirm email change with an invalid token' do
      get confirm_email_url('invalid-token')
      assert_response :unauthorized

      @user.reload
      assert_equal 'testuser@example.com', @user.email
    end

    test 'should not confirm email change with an expired token' do
      @user.request_email_change!('new@example.com')
      @user.update!(email_confirmation_token_valid_until: 1.minute.ago)

      get confirm_email_url(@user.reload.email_confirmation_token)
      assert_response :unauthorized

      @user.reload
      assert_equal 'testuser@example.com', @user.email
      assert_equal 'new@example.com', @user.unconfirmed_email
    end

    test 'confirm_email does not require authentication' do
      @user.request_email_change!('new@example.com')
      token = @user.reload.email_confirmation_token

      get confirm_email_url(token)
      assert_response :success
    end
  end
end
