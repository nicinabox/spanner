class ReminderSerializer < ActiveModel::Serializer
  attributes :id, :notes, :date, :mileage, :reminder_type, :reminder_date,
             :vehicle_id
end
