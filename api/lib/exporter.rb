require 'csv'

class Exporter
  def self.records(vehicle)
    CSV.open(vehicle.name + '.csv', 'w', force_quotes: true) do |csv|
      csv << ['date', 'cost', 'mileage', 'notes']

      vehicle.records.each do |r|
        csv << [r.date, r.cost, r.mileage, r.notes]
      end
    end
  end
end
