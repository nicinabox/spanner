# frozen_string_literal: true

class NotificationDispatcher
  CHANNELS = [EmailChannel, WebhookChannel].freeze

  def self.dispatch(event, **)
    CHANNELS.each do |channel|
      next unless channel.available?

      channel.deliver(event, **)
    rescue StandardError => e
      Rails.logger.error("#{channel}: #{e.message}")
    end
  end
end
