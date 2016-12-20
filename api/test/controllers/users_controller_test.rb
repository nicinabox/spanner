require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    new_session
  end

  test "returns current user" do
    get user_url, http_options(@session.auth_token)
    assert response_body['email'] == @user.email
  end

  test "update current user" do
    put user_url, http_options(@session.auth_token).merge({
      params: {
        user: {
          email: 'nic@test'
        }
      }
    })

    assert response_body['email'] == 'nic@test'
  end
end
