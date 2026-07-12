# frozen_string_literal: true

class NotificationDispatcher
  DEFAULT_CHANNELS = [EmailChannel.new, WebhookChannel.new].freeze

  def initialize(channels: DEFAULT_CHANNELS)
    @channels = channels
  end

  def dispatch(event, **kwargs)
    @channels.each do |channel|
      next unless channel.can_deliver?(event, kwargs[:user])

      channel.deliver(event, **kwargs)
    rescue StandardError => e
      Rails.logger.error("#{channel.class}: #{e.message}")
    end
  end
end
