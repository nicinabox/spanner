class VehicleSerializer < ActiveModel::Serializer
  attributes :id, :name, :vin, :notes, :position, :enable_cost, :retired,
    :created_at, :miles_per_day, :miles_per_year
end
