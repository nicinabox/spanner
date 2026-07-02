require 'test_helper'

module V2
  class WebhooksControllerTest < ActionDispatch::IntegrationTest
    def setup
      @user = users(:one)
      @auth_token = sessions(:one).auth_token
    end

    test 'POST /webhooks/test responds with ok' do
      post webhooks_test_url, headers: { 'Authorization' => "Token #{@auth_token}" }
      assert_response :ok
    end
  end
end
