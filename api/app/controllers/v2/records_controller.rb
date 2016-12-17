module V2
  class RecordsController < ApplicationController
    def index
      vehicle = Vehicle.find(params[:vehicle_id])
      records = vehicle.records.all
      render json: records
    end

    def create
      record = Record.create(params[:record])
      render json: record
    end

    def update

    end

    def destroy
      Record.destroy(params[:id])
    end
  end
end
