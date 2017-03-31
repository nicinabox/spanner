module V2
  class AnalyticsController < ApplicationController
    before_action :authorized_for_analytics?

    def index
      render json: {
        meta: {
          start_date: start_date,
          end_date: end_date,
        },
        new_users: new_users_in_range(start_date, end_date),
        active_users: active_users_in_range(start_date, end_date),
        new_vehicles: new_vehicles_in_range(start_date, end_date),
        new_records: new_records_in_range(start_date, end_date),
        new_reminders: new_reminders_in_range(start_date, end_date),
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
      Time.now
    end

    def new_users_in_range(start_date, end_date)
      User
        .select(user_fields)
        .where(created_at: start_date..end_date)
        .order(created_at: 'desc')
    end

    def active_users_in_range(start_date, end_date)
      User
        .joins(:sessions)
        .select(user_fields)
        .where(sessions: {
          last_seen: start_date..end_date
        })
        .distinct
        .order(created_at: :desc)
    end

    def new_vehicles_in_range(start_date, end_date)
      Vehicle
        .unscoped
        .where(created_at: start_date..end_date)
        .order(created_at: :desc)
    end

    def new_reminders_in_range(start_date, end_date)
      Reminder
        .unscoped
        .where(created_at: start_date..end_date)
        .order(created_at: :desc)
    end

    def new_records_in_range(start_date, end_date)
      Record
        .unscoped
        .where(created_at: start_date..end_date)
        .order(created_at: :desc)
    end

    def user_fields
      [:id, :email, :created_at, :updated_at]
    end
  end
end
