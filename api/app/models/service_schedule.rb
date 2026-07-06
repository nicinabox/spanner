# frozen_string_literal: true

class ServiceSchedule < ApplicationRecord
  PRESETS = YAML.safe_load_file(Rails.root.join('config/presets.yml'), permitted_classes: [Symbol]).deep_symbolize_keys.freeze

  belongs_to :vehicle
  belongs_to :classification
  belongs_to :last_completed_record, class_name: 'Record', optional: true

  # rubocop:disable Rails/RedundantPresenceValidationOnBelongsTo
  validates :vehicle, presence: true
  validates :classification, presence: true
  # rubocop:enable Rails/RedundantPresenceValidationOnBelongsTo
  validates :classification_id, uniqueness: { scope: :vehicle_id }
  validate :at_least_one_interval

  def recalculate_next_due
    unless enabled?
      update!(next_due_date: nil, next_due_mileage: nil)
      return
    end

    last_record = last_matching_record

    attrs = {}
    attrs[:next_due_mileage] = next_mileage(last_record) if distance_interval.present?

    if month_interval.present?
      attrs[:next_due_date] = next_date(last_record)
    elsif distance_interval.present? && attrs[:next_due_mileage]
      mpd = vehicle.miles_per_day
      if mpd&.positive?
        current_mileage = last_record&.mileage || vehicle.estimated_mileage || 0
        remaining_miles = attrs[:next_due_mileage] - current_mileage
        days = (remaining_miles / mpd.to_f).ceil
        attrs[:next_due_date] = Time.zone.today + days.days
      end
    end

    update!(attrs)
  end

  def has_matching_records?
    last_matching_record.present?
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
    base = last_record&.mileage || 0
    base + distance_interval
  end

  def next_date(last_record)
    base = last_record&.date || Time.zone.today
    base + month_interval.months
  end
end
