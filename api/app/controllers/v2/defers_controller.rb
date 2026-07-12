# frozen_string_literal: true

module V2
  class DefersController < ApplicationController
    rescue_from ActionController::BadRequest, with: :bad_request

    def create
      schedule = find_schedule
      set_defer!(schedule)
      render json: schedule
    end

    def update
      schedule = find_schedule
      set_defer!(schedule)
      render json: schedule
    end

    def destroy
      schedule = find_schedule
      schedule.clear_defer!
      schedule.recalculate_next_due
      render json: schedule
    end

    private

    def find_schedule
      vehicle = current_user.vehicles.find(params[:vehicle_id])
      vehicle.service_schedules.find(params[:service_schedule_id])
    end

    def set_defer!(schedule)
      months = params[:months]
      distance = params[:distance]

      if months.blank? && distance.blank?
        raise ActionController::BadRequest, 'months or distance required'
      end

      if months.present?
        unless schedule.month_interval.present?
          raise ActionController::BadRequest, 'schedule has no month interval'
        end

        schedule.defer_delta_months = months.to_i
      end

      if distance.present?
        unless schedule.distance_interval.present?
          raise ActionController::BadRequest, 'schedule has no distance interval'
        end

        schedule.defer_delta_miles = distance.to_i
      end

      schedule.save!
      schedule.recalculate_next_due
    end

    def bad_request(exception)
      render json: { error: exception.message }, status: :bad_request
    end
  end
end