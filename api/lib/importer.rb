# frozen_string_literal: true

require 'csv'

class Importer
  def self.records(vehicle, contents)
    rows = CSV.parse(contents, headers: true)

    ActiveRecord::Base.transaction do
      record_ids = vehicle.record_ids

      RecordClassification.where(record_id: record_ids).delete_all
      # rubocop:disable Rails/SkipsModelValidations
      vehicle.service_schedules
        .where(last_completed_record_id: record_ids)
        .update_all(last_completed_record_id: nil)
      # rubocop:enable Rails/SkipsModelValidations
      ActiveStorage::Attachment.where(record_id: record_ids, record_type: 'Record').delete_all

      vehicle.records.where(id: record_ids).delete_all
      vehicle.records.create!(rows.map(&:to_h))
    end
  end

  def self.fuelly(vehicle, contents)
    rows = CSV.parse(contents, headers: true).map do |row|
      {
        mileage: row[' odometer'],
        cost: row[' price'],
        date: row[' service_date'],
        notes: row[' notes']
      }
    end

    ActiveRecord::Base.transaction do
      record_ids = vehicle.record_ids

      RecordClassification.where(record_id: record_ids).delete_all
      # rubocop:disable Rails/SkipsModelValidations
      vehicle.service_schedules
        .where(last_completed_record_id: record_ids)
        .update_all(last_completed_record_id: nil)
      # rubocop:enable Rails/SkipsModelValidations
      ActiveStorage::Attachment.where(record_id: record_ids, record_type: 'Record').delete_all

      vehicle.records.where(id: record_ids).delete_all
      vehicle.records.create!(rows)
    end
  end
end
