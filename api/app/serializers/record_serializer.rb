class RecordSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :updated_at, :date, :cost, :mileage, :notes, :record_type, :vehicle_id
end
