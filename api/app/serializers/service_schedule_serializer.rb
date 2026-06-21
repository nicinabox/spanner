# frozen_string_literal: true

class ServiceScheduleSerializer < ActiveModel::Serializer
  attributes :id, :vehicle_id, :classification_id, :mileage_interval,
             :month_interval, :notes, :enabled, :last_completed_record_id,
             :next_due_date, :next_due_mileage, :created_at, :updated_at
end
