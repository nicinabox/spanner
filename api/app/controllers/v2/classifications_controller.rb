# frozen_string_literal: true

module V2
  class ClassificationsController < ApplicationController
    def index
      classifications = if params[:vehicle_id]
                          vehicle = vehicles.find(params[:vehicle_id])
                          Classification.for_vehicle(vehicle).order(:name)
                        else
                          Classification.system.order(:name)
                        end
      render json: classifications
    end

    def create
      vehicle = vehicles.find(params[:vehicle_id])
      classification = vehicle.classifications.build(classification_params)
      classification.user = current_user
      classification.system = false
      classification.save!
      render json: classification
    end

    def update
      classification = current_user_classifications.find(params[:id])

      if classification_params[:keywords]
        preset = matching_preset_keywords(classification.name)
        if preset && classification_params[:keywords].sort == preset.sort
          # Keywords match preset defaults — clear DB so serializer fallback picks up future preset updates
          classification.update!(keywords: [])
        else
          classification.update!(classification_params)
        end
      else
        classification.update!(classification_params)
      end

      render json: classification
    end

    def destroy
      classification = Classification.find(params[:id])

      unless classification.vehicle_id.in?(vehicles.pluck(:id))
        render json: { error: 'Cannot delete this classification' }, status: :unprocessable_content
        return
      end

      if classification.service_schedules.any?
        render json: { error: 'Classification used by schedules' }, status: :unprocessable_content
        return
      end

      classification.destroy!
      head :no_content
    rescue ActiveRecord::DeleteRestrictionError
      render json: { error: 'Classification used by schedules' }, status: :unprocessable_content
    end

    private

    def current_user_classifications
      current_user.classifications.where(vehicle_id: vehicles.pluck(:id))
    end

    def vehicles
      current_user.vehicles
    end

    def classification_params
      params.require(:classification).permit(:name, keywords: [])
    end

    def matching_preset_keywords(name)
      ServiceSchedule::PRESETS.each_value do |items|
        items.each do |item|
          return item[:keywords] if item[:name].casecmp?(name)
        end
      end
      nil
    end
  end
end
