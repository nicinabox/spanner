module V2
  class VehiclesController < ApplicationController
    def index
      vehicles = @current_user.vehicles.all
      render json: vehicles
    end

    def create
      vehicle = @current_user.vehicles.build(vehicle_params)

      if vehicle.save
        render json: vehicle
      else
        render json: vehicle.errors, status: 400
      end
    end

    def update

    end

    def destroy
      @current_user.vehicles.destroy(params[:id])
    end

    private

    def vehicle_params
      params.require(:vehicle).permit(:name, :vin, :notes, :position, :enable_cost, :retired)
    end
  end
end
