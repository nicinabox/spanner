require 'importer'

module V2
  class VehiclesController < ApplicationController
    def index
      render json: vehicles.all.order(:position)
    end

    def show
      render json: vehicles.find(params[:id])
    end

    def create
      vehicle = vehicles.build(vehicle_params)
      vehicle.save!
      render json: vehicle
    end

    def update
      vehicle = vehicles.find(params[:id])
      vehicle.update_attributes!(vehicle_params)
      render json: vehicle
    end

    def destroy
      vehicles.destroy(params[:id])
    end

    def import
      vehicle = vehicles.find(params[:vehicle_id])
      if params[:vehicle][:fuelly]
        Importer.fuelly(vehicle, params[:vehicle][:import_file].read)
      else
        Importer.records(vehicle, params[:vehicle][:import_file].read)
      end
    end

    private

    def vehicles
      current_user.vehicles
    end

    def vehicle_params
      params
        .require(:vehicle)
        .permit(
          :name, :vin, :notes, :position, :enable_cost, :retired, :import_file,
          :fuelly
        )
    end
  end
end
