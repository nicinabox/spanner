# frozen_string_literal: true

module V2
  class WebhooksController < ApplicationController
    def test
      reminders = current_user.vehicles.flat_map(&:reminders).first(3)

      if reminders.any?
        WebhookChannel.deliver(:reminder_today, user: current_user, reminders: reminders)
        render json: { message: 'Test notification sent' }, status: :ok
      else
        # Send a generic test even without reminders
        WebhookChannel.deliver(:test, user: current_user, reminders: [])
        render json: { message: 'Test notification sent' }, status: :ok
      end
    end
  end
end
