# frozen_string_literal: true

if ENV['SENTRY_DSN'].present?
  Sentry.init do |config|
    config.dsn = ENV['SENTRY_DSN']
    config.enabled_environments = ['production']
  end
end
