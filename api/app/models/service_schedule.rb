# frozen_string_literal: true

class ServiceSchedule < ApplicationRecord
  def self.validate_preset_group!(type, data)
    raise ArgumentError, "Preset '#{type}' missing 'name'" if data[:name].blank?
    raise ArgumentError, "Preset '#{type}' missing 'distance_unit'" if data[:distance_unit].blank?
    raise ArgumentError, "Preset '#{type}' 'distance_unit' must be an array" unless data[:distance_unit].is_a?(Array)
    raise ArgumentError, "Preset '#{type}' missing 'items'" unless data[:items].is_a?(Array)
  end

  def self.validate_preset_item!(type, item)
    raise ArgumentError, "Preset '#{type}' item missing 'name'" if item[:name].blank?
    raise ArgumentError, "Preset '#{type}' item '#{item[:name]}' missing 'keywords'" unless item[:keywords].is_a?(Array)

    unless item[:intervals].is_a?(Hash)
      raise ArgumentError,
            "Preset '#{type}' item '#{item[:name]}' missing 'intervals'"
    end
    if item[:intervals].empty?
      raise ArgumentError,
            "Preset '#{type}' item '#{item[:name]}' 'intervals' must not be empty"
    end

    item[:intervals].each_key do |key|
      valid = %w[mi km nmi mo hr].include?(key.to_s)
      raise ArgumentError, "Preset '#{type}' item '#{item[:name]}' invalid interval key '#{key}'" unless valid
    end
  end

  PRESETS = Rails.root.glob('config/presets/*.yml').each_with_object({}) do |path, hash|
    type = File.basename(path, '.yml')
    data = YAML.safe_load_file(path, permitted_classes: [Symbol]).deep_symbolize_keys

    validate_preset_group!(type, data)
    data[:items].each { |item| validate_preset_item!(type, item) }

    hash[type] = data
  end.freeze

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
      attrs[:next_due_date] = estimated_next_date(last_record, attrs[:next_due_mileage])
    end

    update!(attrs)
  end

  def matching_records?
    last_matching_record.present?
  end

  def estimated_next_date(last_record, next_due_mileage)
    mpd = vehicle.miles_per_day
    return unless mpd&.positive?

    current_mileage = vehicle.estimated_mileage || last_record&.mileage || 0
    remaining_miles = next_due_mileage - current_mileage

    days = (remaining_miles / mpd.to_f).ceil
    Time.zone.today + days.days
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
    # When there's no matching record, the service hasn't been performed yet.
    # Measure from 0 (not vehicle.estimated_mileage) so the schedule shows as
    # overdue rather than upcoming — a new 5,000-mile service on an 80,000-mile
    # car is overdue, not due at 85,000.
    base = last_record&.mileage || 0
    base + distance_interval
  end

  def next_date(last_record)
    base = last_record&.date || Time.zone.today
    base + month_interval.months
  end
end
