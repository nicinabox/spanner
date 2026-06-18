# frozen_string_literal: true

ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../config/environment', __dir__)
require 'rails/test_help'

module ActiveSupport
  class TestCase
    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    setup do
      seed_classifications
    end

    # Make Action Mailer test helpers (assert_emails, etc.) available in all tests.
    include ActionMailer::TestHelper

    # Add more helper methods to be used by all tests here...

    def seed_classifications
      built_ins = {
        oil_change: { name: 'Oil Change', keywords: %w[oil change] },
        tire_rotation: { name: 'Tire Rotation', keywords: %w[tire rotation] },
        air_filter: { name: 'Air Filter', keywords: %w[air filter] },
        battery: { name: 'Battery', keywords: %w[battery] },
        brake_fluid: { name: 'Brake Fluid', keywords: %w[brake fluid] },
        brakes: { name: 'Brakes', keywords: %w[brakes] },
        cabin_air_filter: { name: 'Cabin Air Filter', keywords: %w[cabin air filter] },
        clutch: { name: 'Clutch', keywords: %w[clutch] },
        coolant: { name: 'Coolant', keywords: %w[coolant] },
        drive_belt: { name: 'Drive Belt', keywords: %w[drive belt] },
        power_steering: { name: 'Power Steering', keywords: %w[power steering] },
        spark_plugs: { name: 'Spark Plugs', keywords: %w[spark plugs] },
        transmission: { name: 'Transmission', keywords: %w[transmission] }
      }

      built_ins.each do |key, attrs|
        Classification.find_or_create_by!(key: key) do |c|
          c.name = attrs[:name]
          c.description = attrs[:keywords].join(', ')
          c.system = true
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
