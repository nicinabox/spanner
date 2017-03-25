class ReminderSerializer < ActiveModel::Serializer
  attributes :id, :notes, :date, :mileage, :reminder_type, :vehicle_id
end
