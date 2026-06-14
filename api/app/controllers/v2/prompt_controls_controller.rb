# frozen_string_literal: true

module V2
  class PromptControlsController < ApplicationController
    skip_before_action :authenticate

    def remind_me_later
      vehicle = find_vehicle
      vehicle.update!(prompt_snoozed_until: 1.month.from_now)

      render plain: 'Reminders snoozed for one month.'
    rescue NotificationToken::InvalidTokenError, ActiveRecord::RecordNotFound
      render plain: 'This link is invalid or has expired.', status: :not_found
    end

    def mute
      vehicle = find_vehicle
      prefs = vehicle.preferences
      prefs.send_prompt_for_records = false
      vehicle.preferences = prefs
      vehicle.save!

      render plain: 'Prompt emails have been muted for this vehicle.'
    rescue NotificationToken::InvalidTokenError, ActiveRecord::RecordNotFound
      render plain: 'This link is invalid or has expired.', status: :not_found
    end

    private

    def find_vehicle
      payload = NotificationToken.verify(params[:token])
      vehicle_id = payload['vehicle_id'] || payload[:vehicle_id]
      Vehicle.find(vehicle_id)
    end
  end
end
