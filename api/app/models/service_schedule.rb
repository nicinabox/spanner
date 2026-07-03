# frozen_string_literal: true

class ServiceSchedule < ApplicationRecord
  PRESETS = {
    car: [
      { name: 'Oil Change', distance_interval: 5000, month_interval: 6 },
      { name: 'Tire Rotation', distance_interval: 7500 },
      { name: 'Air Filter', distance_interval: 30_000 },
      { name: 'Brake Fluid', month_interval: 24 },
      { name: 'Cabin Air Filter', distance_interval: 30_000 },
      { name: 'Coolant', distance_interval: 60_000, month_interval: 60 },
      { name: 'Spark Plugs', distance_interval: 100_000 },
      { name: 'Transmission Fluid', distance_interval: 60_000 },
      { name: 'Drive Belt', distance_interval: 100_000 },
      { name: 'Battery', month_interval: 60 }
    ],
    motorcycle: [
      { name: 'Oil Change', distance_interval: 3000, month_interval: 12 },
      { name: 'Chain Adjustment', distance_interval: 500 },
      { name: 'Chain Replacement', distance_interval: 20_000 },
      { name: 'Brake Fluid', month_interval: 24 },
      { name: 'Spark Plugs', distance_interval: 15_000 },
      { name: 'Air Filter', distance_interval: 12_000 },
      { name: 'Tire Replacement', distance_interval: 10_000 }
    ],
    boat: [
      { name: 'Oil Change', month_interval: 12 },
      { name: 'Hull Cleaning', month_interval: 12 },
      { name: 'Zinc Replacement', month_interval: 12 },
      { name: 'Impelor Service', month_interval: 24 },
      { name: 'Fuel Filter', month_interval: 12 },
      { name: 'Battery', month_interval: 48 },
      { name: 'Antifreeze / Cooling System', month_interval: 24 },
      { name: 'Bilge Pump Check', month_interval: 12 },
      { name: 'Safety Gear Check', month_interval: 12 }
    ],
    rv: [
      { name: 'Oil Change', distance_interval: 5000, month_interval: 12 },
      { name: 'Generator Service', month_interval: 12 },
      { name: 'Propane System Check', month_interval: 12 },
      { name: 'Roof Inspection', month_interval: 6 },
      { name: 'Battery', month_interval: 60 },
      { name: 'Tire Inspection', month_interval: 12 },
      { name: 'Transmission Fluid', distance_interval: 30_000 },
      { name: 'Air Filter', distance_interval: 15_000 }
    ]
  }.freeze

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
