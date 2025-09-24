require 'test_helper'

class V2::UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(email: "testuser@example.com")
    @session = @user.sessions.create!(
      auth_token: "testtoken123",
      auth_token_valid_until: 1.day.from_now,
      last_seen: Time.now
    )
    @headers = {
      accept: "application/json; version=2",
      authorization: "Token #{@session.auth_token}"
    }
  end

  test "should get current user" do
    get user_url, headers: @headers
    assert_response :success
    body = JSON.parse(@response.body)
    assert_equal @user.email, body['email']
  end

  test "should update current user" do
    put user_url, params: { user: { email: 'updated@example.com' } }, headers: @headers
    assert_response :success
    body = JSON.parse(@response.body)
    assert_equal 'updated@example.com', body['email']
    @user.reload
    assert_equal 'updated@example.com', @user.email
  end

  test "should not update user with invalid params" do
    put user_url, params: { user: { email: '' } }, headers: @headers
    assert_response :unprocessable_entity
    body = JSON.parse(@response.body)
    assert body['errors'].present?
  end
end
