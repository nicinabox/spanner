# frozen_string_literal: true

module V2
  class RecordsController < ApplicationController
    skip_before_action :authenticate, only: [:share]

    def index
      render json: records.all
    end

    def show
      render json: records.find(params[:id])
    end

    def share
      vehicle = Vehicle.find(params[:vehicle_id])

      if vehicle.preferences.enable_sharing
        records = vehicle.records.all
        return render json: records
      end

      render_unauthorized
    end

    def create
      record = records.build(record_params)

      record.save!
      render json: record
    end

    def update
      record = records.find(params[:id])

      record.update!(record_params)
      render json: record
    end

    def destroy
      record = records.find(params[:id])

      record.destroy!
      head :no_content
    end

    private

    def records
      vehicle.records
    end

    def vehicle
      vehicles.find(params[:vehicle_id])
    end

    def vehicles
      current_user.vehicles
    end

    def record_params
      params.require(:record).permit(:date, :cost, :mileage, :notes, :record_type)
    end
  end
end
