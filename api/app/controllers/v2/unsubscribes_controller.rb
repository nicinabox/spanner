# frozen_string_literal: true

module V2
  class UnsubscribesController < ApplicationController
    skip_before_action :authenticate

    def show
      payload = NotificationToken.verify(params[:token])
      vehicle = Vehicle.find(payload['vehicle_id'])

      action = payload['action'] || payload[:action]
      prefs = vehicle.preferences

      case action
      when 'prompt'
        prefs.send_prompt_for_records = false
      when 'reminders'
        prefs.send_reminder_emails = false
      end

      vehicle.preferences = prefs
      vehicle.save!

      render plain: 'You have been unsubscribed.'
    rescue NotificationToken::InvalidTokenError, ActiveRecord::RecordNotFound
      render plain: 'This link is invalid or has expired.', status: :not_found
    end
  end
end
