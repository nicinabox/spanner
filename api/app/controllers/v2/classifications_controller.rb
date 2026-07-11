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
      classification = vehicle.classifications.find_or_create_by!(name: classification_params[:name]) do |c|
        c.assign_attributes(classification_params)
        c.user = current_user
        c.system = false
      end
      render json: classification
    end

    def update
      classification = current_user_classifications.find(params[:id])

      classification.update!(classification_params.except(:keywords))

      if classification_params[:keywords]
        preset = matching_preset_keywords(classification.name)
        if preset && classification_params[:keywords].sort == preset.sort
          # Keywords match preset defaults — clear DB so serializer fallback picks up future preset updates
          classification.update!(keywords: [])
        else
          classification.update!(keywords: classification_params[:keywords])
        end
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
      Classification.where(user_id: [nil, current_user.id], vehicle_id: [nil, *vehicles.pluck(:id)])
    end

    def vehicles
      current_user.vehicles
    end

    def classification_params
      params.require(:classification).permit(:name, keywords: [])
    end

    def matching_preset_keywords(name)
      all = ServiceSchedule::PRESETS.each_value.flat_map do |group|
        group[:items].select { |item| item[:name].casecmp?(name) }.flat_map { |item| item[:keywords] }
      end
      all.uniq.presence
    end
  end
end
