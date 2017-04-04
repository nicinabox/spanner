require 'csv'

class Importer
  def self.records(vehicle, string)
    rows = CSV.parse(string, { headers: true })
    vehicle.records.delete_all
    vehicle.records.create!(rows.map { |r| r.to_h })
  end

  def self.fuelly(vehicle, string)
    rows = CSV.parse(string, { headers: true }).map do |row|
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
