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
  before_save :normalize_zero_intervals

  scope :deferred, -> { where.not(defer_delta_months: nil).or(where.not(defer_delta_miles: nil)) }

  def deferred?
    defer_delta_months.present? || defer_delta_miles.present?
  end

  # rubocop:disable Naming/PredicateMethod
  def deferred
    deferred?
  end
  # rubocop:enable Naming/PredicateMethod

  def clear_defer!
    update!(defer_delta_months: nil, defer_delta_miles: nil)
  end

  def recalculate_next_due
    unless enabled?
      update!(next_due_date: nil, next_due_mileage: nil)
      return
    end

    last_record = last_matching_record

    attrs = {}
    attrs[:next_due_mileage] = computed_next_mileage(last_record)

    date_from_months = next_date(last_record) if month_interval.to_i.nonzero?
    date_from_months = Time.zone.today + defer_delta_months.months if date_from_months && defer_delta_months.present?

    date_from_mileage = nil
    if distance_interval.to_i.nonzero? && attrs[:next_due_mileage]
      date_from_mileage = estimated_next_date(last_record, attrs[:next_due_mileage])
    end

    attrs[:next_due_date] = pick_due_date(date_from_months, date_from_mileage)

    update!(attrs)
  end

  def complete!(notes: nil, date: nil, mileage: nil)
    record = vehicle.records.create!(
      date: date || Time.zone.today,
      mileage: mileage || vehicle.estimated_mileage,
      notes: notes.presence || classification.name
    )

    record.record_classifications.find_or_create_by!(classification: classification) do |rc|
      rc.classifier = 'manual'
      rc.confidence = 1.0
      rc.auto_tagged = false
    end

    update!(last_completed_record_id: record.id)
    clear_defer!
    recalculate_next_due
    record
  end

  private

  def matching_records?
    last_matching_record.present?
  end

  def estimated_next_date(last_record, next_due_mileage)
    mpd = vehicle.miles_per_day
    return unless mpd&.positive?

    current_mileage = vehicle.estimated_mileage || last_record&.mileage || 0
    remaining_miles = next_due_mileage - current_mileage

    return Time.zone.today if remaining_miles <= 0

    days = (remaining_miles / mpd.to_f).ceil
    Time.zone.today + days.days
  end

  def at_least_one_interval
    return if distance_interval.present? || month_interval.present?

    errors.add(:distance_interval, :required)
    errors.add(:month_interval, :required)
  end

  def normalize_zero_intervals
    self.distance_interval = nil if distance_interval&.zero?
    self.month_interval = nil if month_interval&.zero?
  end

  def pick_due_date(date_from_months, date_from_mileage)
    if date_from_mileage
      date_from_months ? [date_from_months, date_from_mileage].min : date_from_mileage
    elsif date_from_months
      date_from_months
    end
  end

  def computed_next_mileage(last_record)
    base = next_mileage(last_record) if distance_interval.to_i.nonzero?
    base && defer_delta_miles.present? ? base + defer_delta_miles : base
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
