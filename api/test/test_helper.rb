ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
  def http_options(auth_token)
    {
      headers: {
        accept: "application/json; version=2",
        authorization: "Token #{auth_token}"
      }
    }
  end

  def response_body
    JSON.parse(@response.body)
  end

  def new_session
    @user = User.create({ email: "user@test" })
    @session = @user.sessions.build(auth_token: SecureRandom.urlsafe_base64(24))
    @session.save!
  end
end
