# frozen_string_literal: true

class Record < ApplicationRecord
  validates :notes, :date, presence: true
  validate :mileage_greater_than_trailing_record
  validate :mileage_less_than_leading_record

  belongs_to :vehicle

  has_many_attached :attachments, dependent: :purge

  MAX_ATTACHMENT_SIZE = 10.megabytes

  has_many :record_classifications, dependent: :destroy
  has_many :classifications, through: :record_classifications

  default_scope { order(date: :asc, id: :asc) }

  after_update :update_mileage_reminders
  after_destroy :update_mileage_reminders
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
    record_classifications.destroy_all
    return if notes.blank?

    HeuristicClassifier.classify(notes).each do |result|
      record_classifications.create!(
        classification: result[:classification],
        classifier: result[:classifier],
        confidence: result[:confidence]
      )
    end
  end

  def advance_matching_service_schedules
    matching_schedules = vehicle.service_schedules.where(classification_id: classifications.pluck(:id))
    matching_schedules.each(&:generate_reminder)
  end
end
