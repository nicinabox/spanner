class RecordSerializer < ActiveModel::Serializer
  attributes :id, :date, :cost, :mileage, :notes
end
