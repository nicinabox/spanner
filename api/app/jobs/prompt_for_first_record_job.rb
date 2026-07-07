# frozen_string_literal: true

class PromptForFirstRecordJob < ApplicationJob
  def perform(vehicle_id)
    vehicle = Vehicle.find_by(id: vehicle_id)
    return unless vehicle

    vehicle.prompt_for_first_record!
  end
end
