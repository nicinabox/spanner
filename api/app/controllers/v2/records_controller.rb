module V2
  class RecordsController < ApplicationController
    def index
      vehicle = vehicles.find(params[:vehicle_id])
      render json: records.all
    end

    def create
      vehicle = vehicles.find(params[:vehicle_id])
      record = vehicle.records.build(record_params)

      record.save!
      render json: record
    end

    def update
      record = vehicles.records.find(params[:id])

      record.update_attributes!(reminder_params)
      render json: record
    end

    def destroy
      vehicles.records.destroy(params[:id])
    end

    private

    def vehicles
      current_user.vehicles
    end

    def record_params
      params.require(:reminder).permit(:date, :cost, :mileage, :notes)
    end
  end
end
