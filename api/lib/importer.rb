# frozen_string_literal: true

require 'csv'

class Importer
  def self.records(vehicle, contents)
    rows = CSV.parse(contents, headers: true)
    vehicle.records.delete_all
    vehicle.records.create!(rows.map(&:to_h))
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

    vehicle.records.delete_all
    vehicle.records.create!(rows)
  end
end
