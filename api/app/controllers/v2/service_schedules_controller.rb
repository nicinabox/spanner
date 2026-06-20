# frozen_string_literal: true

module V2
  class ServiceSchedulesController < ApplicationController
    def index
      render json: schedules.all
    end

    def show
      render json: schedules.find(params[:id])
    end

    def create
      schedule = schedules.build(schedule_params)
      schedule.save!
      schedule.generate_reminder
      render json: schedule
    end

    def update
      schedule = schedules.find(params[:id])
      schedule.update!(schedule_params)
      schedule.generate_reminder
      render json: schedule
    end

    def destroy
      schedule = schedules.find(params[:id])
      schedule.destroy!
      head :no_content
    end

    def complete
      schedule = schedules.find(params[:id])
      schedule.complete!(
        notes: params[:notes],
        date: params[:date],
        mileage: params[:mileage]
      )
      render json: schedule
    end

    private

    def schedules
      vehicle.service_schedules
    end

    def vehicle
      vehicles.find(params[:vehicle_id])
    end

    def vehicles
      current_user.vehicles
    end

    def schedule_params
      params.expect(
        service_schedule: %i[classification_id mileage_interval month_interval notes enabled]
      )
    end
  end
end
