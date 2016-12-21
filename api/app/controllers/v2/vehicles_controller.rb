module V2
  class VehiclesController < ApplicationController
    def index
      render json: vehicles.all.order(:position)
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

    private

    def vehicles
      current_user.vehicles
    end

    def vehicle_params
      params.require(:vehicle).permit(:name, :vin, :notes, :position, :enable_cost, :retired)
    end
  end
end
