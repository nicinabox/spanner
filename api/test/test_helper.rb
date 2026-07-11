# frozen_string_literal: true

ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../config/environment', __dir__)
require 'rails/test_help'

module ActiveSupport
  class TestCase
    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    setup do
      Rack::Attack.cache.store.clear if Rack::Attack.cache.store.respond_to?(:clear)
    end

    # Make Action Mailer test helpers (assert_emails, etc.) available in all tests.
    include ActionMailer::TestHelper

    # Add more helper methods to be used by all tests here...

    def seed_classifications
      built_ins = {
        'Oil Change' => %w[oil change],
        'Tire Rotation' => %w[tire rotation],
        'Air Filter' => %w[air filter],
        'Battery' => %w[battery],
        'Brake Fluid' => %w[brake fluid],
        'Brakes' => %w[brakes],
        'Cabin Air Filter' => %w[cabin air filter],
        'Clutch' => %w[clutch],
        'Coolant' => %w[coolant],
        'Drive Belt' => %w[drive belt],
        'Power Steering' => %w[power steering],
        'Spark Plugs' => %w[spark plugs],
        'Transmission' => %w[transmission]
      }

      built_ins.each do |name, keywords|
        next unless Vehicle.table_exists? && Vehicle.any?

        vehicle = Vehicle.first
        Classification.find_or_create_by!(name:, vehicle:) do |c|
          c.keywords = keywords
        end
      end
    end

    def http_options(auth_token = nil)
      {
        headers: {
          accept: 'application/json; version=2',
          authorization: "Token #{auth_token}"
        }
      }
    end

    def response_body
      return true if @response.body.empty?

      ::JSON.parse(@response.body)
    end

    def new_session
      @user = User.where({ email: 'user1@test' }).first
      @session = @user.sessions.first
    end
  end
end
