require 'tempfile'
require 'importer'
require 'exporter'

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
      contents = params[:vehicle][:import_file].read

      if params[:vehicle][:fuelly] == 'true'
        Importer.fuelly(vehicle, contents)
      else
        Importer.records(vehicle, contents)
      end
    end

    def export
      vehicle = vehicles.find(params[:vehicle_id])
      tempfile = Tempfile.new('tmp')
      Exporter.records(vehicle, tempfile)

      send_file tempfile,
        filename: vehicle.name + '.csv'
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
