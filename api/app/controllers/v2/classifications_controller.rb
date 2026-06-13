# frozen_string_literal: true

module V2
  class ClassificationsController < ApplicationController
    def index
      render json: Classification.system.order(:name)
    end
  end
end
