module V2
  class RecordsController < ApplicationController
    def index
      render json: records.all.filter {|r| r.record_type != 'mileage adjustment' }
    end

    def show
      render json: records.find(params[:id])
    end

    def create
      record = records.build(record_params)

      record.save!
      render json: record
    end

    def update
      record = records.find(params[:id])

      record.update_attributes!(record_params)
      render json: record
    end

    def destroy
      record = records.find(params[:id])

      record.destroy!
      render :success
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
