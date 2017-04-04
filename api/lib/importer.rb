require 'csv'

class Importer
  def self.records(vehicle, file)
    rows = CSV.foreach(file, { headers: true })
    vehicle.records.delete_all
    vehicle.records.create(rows.map { |r| r.to_h })
  end
end
