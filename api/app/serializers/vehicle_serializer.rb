class VehicleSerializer < ActiveModel::Serializer
  attributes :id, :name, :vin, :notes, :position, :enable_cost, :created_at
end
