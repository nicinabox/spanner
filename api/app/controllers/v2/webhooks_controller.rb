# frozen_string_literal: true

module V2
  class WebhooksController < ApplicationController
    def test
      reminders = current_user.vehicles.flat_map(&:reminders).first(3)

      if reminders.any?
        WebhookChannel.new.deliver(:reminder_today, user: current_user, reminders: reminders)
      else
        # Send a generic test even without reminders
        WebhookChannel.new.deliver(:test, user: current_user, reminders: [])
      end
      render json: { message: 'Test notification sent' }, status: :ok
    end
  end
end
