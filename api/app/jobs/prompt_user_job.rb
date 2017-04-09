class PromptUserJob < ApplicationJob
  queue_as :default

  def perform
    # prompt_to_add_first_record
    # prompt_to_add_first_vehicle
    prompt_to_add_new_record
  end

  # TODO: How to prevent users from getting this every day?
  def prompt_to_add_first_vehicle
    users = User.includes(:vehicles).where(vehicles: { id: nil })

    users.each do |user|
      PromptUserMailer.add_first_vehicle(user)
    end
  end

  # TODO: How to prevent users from getting this every day?
  def prompt_to_add_first_record
    vehicles = Vehicle.includes(:records).where(records: { id: nil })

    vehicles.each do |vehicle|
      PromptUserMailer.add_first_record(vehicle.user, vehicle)
    end
  end

  def prompt_to_add_new_record
    today = Date.today
    vehicles = Vehicle
      .joins(:records )
      .where(retired: false)
      .group('vehicles.id')
      .having('count(vehicle_id) > 2')

    vehicles.each do |vehicle|
      date = vehicle.records.last.date + vehicle.mean_days_between_records.days

      if date.between?(today.beginning_of_day, today.end_of_day)
        PromptUserMailer.add_record(vehicle.user, vehicle)
      end
    end
  end
end
