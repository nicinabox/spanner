module V2
  class VehiclesController < ApplicationController
    def index
      @vehicles = @current_user.vehicles.all
      render json: @vehicles
    end
  end
end
