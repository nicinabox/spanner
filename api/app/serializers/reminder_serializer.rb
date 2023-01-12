class ReminderSerializer < ActiveModel::Serializer
  attributes :id, :notes, :date, :mileage, :reminder_type, :reminder_date,
             :vehicle_id, :created_at, :updated_at
end
