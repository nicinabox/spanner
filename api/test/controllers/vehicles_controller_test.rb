require 'test_helper'

class VehiclesControllerTest < ActionDispatch::IntegrationTest
  setup do
    new_session
  end

  test "gets all vehicles" do
    get vehicles_url, http_options(@session.auth_token)
    assert_equal [], response_body
  end
end
