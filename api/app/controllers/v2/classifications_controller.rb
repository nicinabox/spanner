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
      classification.update!(classification_params)
      render json: classification
    end

    def destroy
      classification = Classification.find(params[:id])

      unless classification.vehicle_id.in?(vehicles.pluck(:id))
        render json: { error: 'Cannot delete this classification' }, status: :unprocessable_entity
        return
      end

      if classification.service_schedules.any?
        render json: { error: 'Tag used by schedules' }, status: :unprocessable_entity
        return
      end

      classification.destroy!
      head :no_content
    rescue ActiveRecord::DeleteRestrictionError
      render json: { error: 'Tag used by schedules' }, status: :unprocessable_entity
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
  end
end