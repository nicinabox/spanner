class PromptUserJob < ApplicationJob
  queue_as :default

  def perform
    prompt_to_add_new_record
  end

  def prompt_to_add_first_vehicle
    # TODO
  end

  def prompt_to_add_first_record
    # TODO
  end

  def prompt_to_add_new_record
    today = Date.today
    vehicles = Vehicle.joins(:records ).where(retired: false).group('vehicles.id').having('count(vehicle_id) > 2')

    vehicles.each do |vehicle|
      date = vehicle.records.last.date + vehicle.mean_days_between_records.days

      if date.between?(today.beginning_of_day, today.end_of_day)
        PromptUserMailer.add_record(vehicle.user, vehicle)
      end
    end
  end
end
