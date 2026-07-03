# frozen_string_literal: true

require 'tempfile'
require 'importer'
require 'exporter'

module V2
  class VehiclesController < ApplicationController
    skip_before_action :authenticate, only: [:share]

    VEHICLE_JSON_METHODS = %i[estimated_mileage miles_per_day miles_per_year reminders squish_vin].freeze

    def index
      render json: vehicles.map { |v|
        v.as_json(methods: VEHICLE_JSON_METHODS).merge(is_shared: v.user_id != current_user.id)
      }
    end

    def show
      vehicle = vehicles.find(params[:id])
      is_shared = vehicle.user_id != current_user.id
      render json: vehicle.as_json(methods: VEHICLE_JSON_METHODS).merge(is_shared: is_shared)
    end

    def share
      vehicle = Vehicle.find(params[:vehicle_id])

      return render json: vehicle if vehicle.preferences.enable_sharing

      render_unauthorized
    end

    def create
      vehicle = current_user.vehicles.build(vehicle_params)
      vehicle.save!

      GoodJob.set(wait: 24.hours).perform_later(vehicle, 'prompt_for_first_record!')

      render json: vehicle
    end

    def update
      vehicle = current_user.vehicles.find(params[:id])
      vehicle.update!(vehicle_params)
      render json: vehicle
    end

    def destroy
      vehicle = current_user.vehicles.find(params[:id])
      vehicle.destroy!
      head :no_content
    end

    def import
      vehicle = current_user.vehicles.find(params[:vehicle_id])
      contents = params[:vehicle][:import_file].read

      if params[:vehicle][:fuelly] == 'true'
        Importer.fuelly(vehicle, contents)
      else
        Importer.records(vehicle, contents)
      end

      head :ok
    end

    def export
      vehicle = current_user.vehicles.find(params[:vehicle_id])
      tempfile = Tempfile.new('tmp')
      Exporter.records(vehicle, tempfile)

      send_file tempfile,
                filename: "#{vehicle.name}.csv"
    end

    private

    def vehicles
      current_user.accessible_vehicles
    end

    def vehicle_params
      params
        .expect(
          vehicle: [:name, :vin, :notes, :position, :enable_cost, :distance_unit,
                    :retired, :import_file, :fuelly, :color,
                    { preferences: %i[
                      enable_cost
                      send_reminder_emails
                      send_prompt_for_records
                      show_mileage_adjustment_records
                    ] }]
        )
    end
  end
end
