# frozen_string_literal: true

module V2
  class ClassificationsController < ApplicationController
    def index
      vehicle = vehicles.find(params[:vehicle_id])
      render json: vehicle.classifications.order(:name)
    end

    def create
      vehicle = vehicles.find(params[:vehicle_id])
      classification = vehicle.classifications.find_or_create_by!(name: classification_params[:name]) do |c|
        c.keywords = classification_params[:keywords] || []
      end
      render json: classification
    end

    def update
      classification = vehicle_classification(params[:id])

      classification.update!(keywords: classification_params[:keywords]) if classification_params[:keywords]

      render json: classification
    end

    def destroy
      classification = vehicle_classification(params[:id])

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

    def vehicle_classification(id)
      vehicles.joins(:classifications).where(classifications: { id: }).first!.classifications.find(id)
    end

    def vehicles
      current_user.vehicles
    end

    def classification_params
      params.require(:classification).permit(:name, keywords: [])
    end
  end
end
