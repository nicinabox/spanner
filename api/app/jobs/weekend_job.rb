# frozen_string_literal: true

class WeekendJob < ApplicationJob
  queue_as :low_priority

  def perform
    puts "Performing weekend job"
    prompt_to_add_new_record
  end

  def prompt_to_add_new_record
    vehicles = Vehicle
               .joins(:records)
               .where(retired: false)
               .group('vehicles.id')
               .having('count(vehicle_id) > 2')

    vehicles.each(&:prompt_to_add_new_record!)
  end
end
