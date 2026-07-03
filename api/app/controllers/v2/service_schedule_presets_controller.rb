# frozen_string_literal: true

module V2
  class ServiceSchedulePresetsController < ApplicationController
    def index
      render json: ServiceSchedule::PRESETS
    end
  end
end
