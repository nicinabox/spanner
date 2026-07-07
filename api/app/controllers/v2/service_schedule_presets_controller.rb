# frozen_string_literal: true

module V2
  class ServiceSchedulePresetsController < ApplicationController
    def index
      presets = ServiceSchedule::PRESETS

      if params[:distance_unit].present?
        presets = presets.select { |_, group| group[:distance_unit] == params[:distance_unit] }
      end

      render json: presets
    end
  end
end
