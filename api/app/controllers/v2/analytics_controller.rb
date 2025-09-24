# frozen_string_literal: true

module V2
  class AnalyticsController < ApplicationController
    before_action :authorized_for_analytics?

    def index
      analytics = Analytics.new(start_date, end_date)

      render json: {
        meta: {
          start_date: start_date,
          end_date: end_date
        },
        new_users: analytics.new_users,
        active_users: analytics.active_users,
        active_mobile_users: analytics.active_mobile_users,
        total_mobile_users: analytics.total_mobile_users,
        new_vehicles: analytics.new_vehicles,
        new_records: analytics.new_records,
        new_reminders: analytics.new_reminders
      }
    end

    private

    def authorized_for_analytics?
      current_user.can_access_analytics? || render_unauthorized
    end

    def render_unauthorized
      respond_with_error 'Not Authorized', status: :unauthorized
    end

    def start_date
      (params[:timeframe] || 30).to_i.days.ago.beginning_of_day
    end

    def end_date
      Time.zone.now
    end
  end
end
