ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
  def http_options(auth_token = nil)
    {
      headers: {
        accept: "application/json; version=2",
        authorization: "Token #{auth_token}"
      }
    }
  end

  def response_body
    if @response.body.empty?
      return true
    else
      JSON.parse(@response.body)
    end
  end

  def new_session
    @user = User.where({ email: "user1@test" }).first
    @session = @user.sessions.first
  end
end
