class WeekendJob < ApplicationJob
  def perform
    prompt_to_add_new_record
  end

  def prompt_to_add_new_record
    vehicles = Vehicle
      .joins(:records)
      .where(retired: false)
      .group('vehicles.id')
      .having('count(vehicle_id) > 2')

    vehicles.each do |vehicle|
      vehicle.prompt_to_add_new_record!
    end
  end
end
