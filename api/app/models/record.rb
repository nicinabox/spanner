# frozen_string_literal: true

class Record < ApplicationRecord
  include SecureAttachments

  validates :notes, :date, presence: true
  validate :mileage_greater_than_trailing_record
  validate :mileage_less_than_leading_record

  belongs_to :vehicle

  has_many :record_classifications, dependent: :destroy
  has_many :classifications, through: :record_classifications

  default_scope { order(date: :asc, id: :asc) }

  after_update :update_mileage_reminders, :recalculate_matching_service_schedules
  before_destroy :capture_schedule_classification_ids, prepend: true
  after_destroy :update_mileage_reminders, :recalculate_matching_service_schedules
  after_save :update_mileage_reminders, :classify_notes, :advance_matching_service_schedules

  def mileage_greater_than_trailing_record
    return if mileage.nil? || mileage.zero?

    trailing_record = vehicle.records
      .where(date: ...date)
      .where('mileage > ?', 0)
      .where.not(id: id)
      .last

    return unless trailing_record && mileage < trailing_record.mileage

    errors.add(:mileage, "must be greater than #{trailing_record.mileage.to_i} on this date")
  end

  def mileage_less_than_leading_record
    return if mileage.nil? || mileage.zero?

    leading_record = vehicle.records
      .where('date > ?', date)
      .where('mileage > ?', 0)
      .where.not(id: id)
      .first

    return unless leading_record && mileage > leading_record.mileage

    errors.add(:mileage, "must be less than #{leading_record.mileage.to_i}")
  end

  def update_mileage_reminders
    vehicle.reminders.each(&:save)
  end

  def classify_notes
    return if notes.blank? || !saved_changes?

    HeuristicClassifier.classify(notes, vehicle:).each do |result|
      next if result[:confidence] < 0.25
      next unless vehicle.service_schedules.exists?(classification_id: result[:classification].id)
      next if record_classifications.exists?(classification_id: result[:classification].id)

      record_classifications.create!(
        classification: result[:classification],
        classifier: result[:classifier],
        confidence: result[:confidence],
        auto_tagged: true
      )
    end
  end

  def advance_matching_service_schedules
    vehicle.service_schedules.find_each(&:recalculate_next_due)
  end

  def sync_manual_classifications(raw_ids)
    new_ids = raw_ids.compact_blank.map(&:to_i)
    existing = classification_ids
    to_add = new_ids - existing
    to_remove = existing - new_ids

    to_add.each do |cid|
      record_classifications.find_or_create_by!(classification_id: cid, classifier: 'manual', confidence: 1.0,
                                                auto_tagged: false)
    end
    record_classifications.where(classification_id: to_remove).destroy_all

    recalculate_matching_service_schedules(to_add + to_remove)
  end

  def capture_schedule_classification_ids
    @schedule_classification_ids = classifications.pluck(:id)
  end

  def recalculate_matching_service_schedules(ids = nil)
    ids ||= @schedule_classification_ids || classifications.pluck(:id)
    return if ids.empty?

    vehicle.service_schedules.where(classification_id: ids).find_each(&:recalculate_next_due)
  end
end
