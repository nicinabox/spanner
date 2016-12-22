class ReminderSerializer < ActiveModel::Serializer
  attributes :id, :notes, :date
end
