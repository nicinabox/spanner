class VehicleSerializer < ActiveModel::Serializer
  attributes :id, :name, :vin, :notes, :position, :enable_cost, :distance_unit,
    :retired, :created_at, :miles_per_day, :miles_per_year, :estimated_mileage,
    :squish_vin, :reminders
end
