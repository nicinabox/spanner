# frozen_string_literal: true

module V2
  class PostmarkController < ApplicationController
    skip_before_action :authenticate

    BOUNCE_TYPES = %w[HardBounce SpamComplaint].freeze

    # Public webhook receiver for all Postmark events.
    # Postmark sends different event types to the same endpoint.
    # Payload structure varies by event — we dispatch based on the fields present.
    # Currently handles: bounce/spam complaints (disables reminders for the user).
    # Other event types are accepted but ignored.
    def webhook
      email = webhook_email
      return head :ok if email.blank?

      disable_reminders_for(email) if bounce_event?

      head :ok
    end

    private

    def webhook_email
      (params[:Email] || params[:Recipient])&.strip&.downcase
    end

    def bounce_event?
      BOUNCE_TYPES.include?(params[:Type])
    end

    def disable_reminders_for(email)
      user = User.find_by(email: email)
      user&.update!(email_bounced_at: Time.zone.now)
    end
  end
end
