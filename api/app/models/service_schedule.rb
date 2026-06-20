# frozen_string_literal: true

class ServiceSchedule < ApplicationRecord
  belongs_to :vehicle
  belongs_to :classification
  has_one :reminder, dependent: :destroy

  # rubocop:disable Rails/RedundantPresenceValidationOnBelongsTo
  validates :vehicle, presence: true
  validates :classification, presence: true
  # rubocop:enable Rails/RedundantPresenceValidationOnBelongsTo
  validate :at_least_one_interval

  def generate_reminder
    return destroy_reminder unless enabled?

    last_record = last_matching_record

    reminder_data = {
      vehicle: vehicle,
      service_schedule: self,
      notes: classification.name
    }

    if mileage_interval.present?
      reminder_data[:mileage] = next_mileage(last_record)
      reminder_data[:reminder_type] = 'mileage'
    end

    if month_interval.present?
      reminder_data[:date] = next_date(last_record)
      reminder_data[:reminder_type] = if mileage_interval.present?
                                        'date_or_mileage'
                                      else
                                        'date'
                                      end
    end

    if reminder
      reminder.update!(reminder_data)
    else
      Reminder.create!(reminder_data)
    end
  end

  def complete!(notes: nil, date: nil, mileage: nil)
    record = vehicle.records.create!(
      date: date || Time.zone.today,
      mileage: mileage || vehicle.estimated_mileage,
      notes: notes.presence || classification.name
    )

    update!(last_completed_record_id: record.id)
    generate_reminder
    record
  end

  private

  def at_least_one_interval
    return if mileage_interval.present? || month_interval.present?

    errors.add(:base, 'at least one of mileage_interval or month_interval must be present')
  end

  def destroy_reminder
    reminder&.destroy
    association(:reminder).reset
  end

  def last_matching_record
    vehicle.records
           .joins(:classifications)
           .where(classifications: { id: classification_id })
           .reorder(date: :desc)
           .first
  end

  def next_mileage(last_record)
    base_mileage = last_record&.mileage || vehicle.estimated_mileage || 0
    base_mileage + mileage_interval
  end

  def next_date(last_record)
    base_date = last_record&.date || Time.zone.today
    base_date + month_interval.months
  end
end
