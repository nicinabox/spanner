class RecordSerializer < ActiveModel::Serializer
  attributes :id, :date, :cost, :mileage, :notes, :record_type
end
