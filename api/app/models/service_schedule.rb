# frozen_string_literal: true

class ServiceSchedule < ApplicationRecord
  belongs_to :vehicle
  belongs_to :classification

  # rubocop:disable Rails/RedundantPresenceValidationOnBelongsTo
  validates :vehicle, presence: true
  validates :classification, presence: true
  # rubocop:enable Rails/RedundantPresenceValidationOnBelongsTo
  validate :at_least_one_interval

  def recalculate_next_due
    unless enabled?
      update!(next_due_date: nil, next_due_mileage: nil)
      return
    end

    last_record = last_matching_record

    attrs = {}
    attrs[:next_due_mileage] = next_mileage(last_record) if distance_interval.present?
    attrs[:next_due_date] = next_date(last_record) if month_interval.present?

    update!(attrs)
  end

  def complete!(notes: nil, date: nil, mileage: nil)
    record = vehicle.records.create!(
      date: date || Time.zone.today,
      mileage: mileage || vehicle.estimated_mileage,
      notes: notes.presence || classification.name
    )

    update!(last_completed_record_id: record.id)
    recalculate_next_due
    record
  end

  private

  def at_least_one_interval
    return if distance_interval.present? || month_interval.present?

    errors.add(:base, 'at least one of distance_interval or month_interval must be present')
  end

  def last_matching_record
    vehicle.records
           .joins(:classifications)
           .where(classifications: { id: classification_id })
           .reorder(date: :desc)
           .first
  end

  def next_mileage(last_record)
    base = last_record&.mileage || vehicle.estimated_mileage || 0
    base + distance_interval
  end

  def next_date(last_record)
    base = last_record&.date || Time.zone.today
    base + month_interval.months
  end
end
