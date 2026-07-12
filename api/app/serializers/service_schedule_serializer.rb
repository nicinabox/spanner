# frozen_string_literal: true

class ServiceScheduleSerializer < ActiveModel::Serializer
  attributes :id, :vehicle_id, :classification_id, :classification_name, :distance_interval,
             :month_interval, :notes, :enabled, :last_completed_record_id,
             :next_due_date, :next_due_mileage,
             :deferred, :defer_delta_months, :defer_delta_miles,
             :created_at, :updated_at

  belongs_to :classification

  def classification_name
    object.classification&.name
  end
end
