class WeekendJob < ApplicationJob
  queue_as :default

  def perform
    prompt_to_add_new_record
  end

  def prompt_to_add_new_record
    today = Date.today
    vehicles = Vehicle
      .joins(:records )
      .where(retired: false)
      .group('vehicles.id')
      .having('count(vehicle_id) > 2')

    vehicles.each do |vehicle|
      date = vehicle.estimated_next_record_date

      if date and date <= Date.today.beginning_of_day
        PromptUserMailer.add_record(vehicle.user, vehicle)
      end
    end
  end
end
