# frozen_string_literal: true

module V2
  class ServiceSchedulePresetsController < ApplicationController
    def index
      presets = ServiceSchedule::PRESETS

      if params[:distance_unit].present?
        presets = presets.select do |_, group|
          units = Array(group[:distance_unit])
          units.include?(params[:distance_unit])
        end
      end

      render json: presets
    end
  end
end
