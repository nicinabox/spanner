# frozen_string_literal: true

class VehicleSerializer < ActiveModel::Serializer
  attributes :id, :name, :vin, :notes, :position, :enable_cost, :distance_unit,
             :retired, :created_at, :miles_per_day, :miles_per_year, :estimated_mileage,
             :squish_vin, :color, :preferences

  has_many :reminders
  has_many :service_schedules
end
