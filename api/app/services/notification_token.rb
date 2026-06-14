# frozen_string_literal: true

class NotificationToken
  class InvalidTokenError < StandardError; end

  TOKEN_VERIFIER = 'notification_controls'
  DEFAULT_EXPIRES_IN = 30.days

  def self.generate(vehicle_id:, action:)
    new(vehicle_id: vehicle_id, action: action).generate
  end

  def self.verify(token)
    new(token: token).verify
  end

  def initialize(vehicle_id: nil, action: nil, token: nil)
    @vehicle_id = vehicle_id
    @action = action
    @token = token
  end

  def generate
    message = {
      vehicle_id: @vehicle_id,
      action: @action,
      expires_at: DEFAULT_EXPIRES_IN.from_now.to_i
    }

    verifier.generate(message)
  end

  def verify
    payload = verifier.verify(@token)
    raise InvalidTokenError, 'Invalid token' unless payload

    expires_at = payload['expires_at'] || payload[:expires_at]
    raise InvalidTokenError, 'Invalid token' unless expires_at

    if Time.at(expires_at) < Time.now
      raise InvalidTokenError, 'Token expired'
    end

    payload.with_indifferent_access
  rescue ActiveSupport::MessageVerifier::InvalidSignature
    raise InvalidTokenError, 'Invalid token'
  end

  private

  def verifier
    Rails.application.message_verifier(TOKEN_VERIFIER)
  end
end
