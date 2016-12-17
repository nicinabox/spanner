module V2
  class VehiclesController < ApplicationController
    def index
      vehicles = @current_user.vehicles.all
      render json: vehicles
    end

    def create
      vehicle = @current_user.vehicles.build(params[:vehicle])

      if vehicle.save
        render json: vehicle
      else
        render json: vehicle.errors, status: 400
      end
    end

    def update

    end

    def destroy
      @current_user.vehicle.destroy(params[:id])
    end
  end
end
