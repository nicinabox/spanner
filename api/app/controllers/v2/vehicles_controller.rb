module V2
  class VehiclesController < ApplicationController
    def index
      vehicles = vehicles.all
      render json: vehicles
    end

    def create
      vehicle = vehicles.build(vehicle_params)

      if vehicle.save
        render json: vehicle
      else
        respond_with_errors(vehicle)
      end
    end

    def update
      vehicle = vehicles.find(params[:id])

      if vehicle.update_attributes(vehicle_params)
        render json: vehicle
      else
        respond_with_errors(vehicle)
      end
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
