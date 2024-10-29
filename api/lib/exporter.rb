require 'csv'

class Exporter
  def self.records(vehicle, file)
    CSV.open(file, 'wb', force_quotes: true) do |csv|
      csv << ['date', 'cost', 'mileage', 'notes']

      vehicle.records.each do |r|
        csv << [r.date, r.cost, r.mileage, r.notes]
      end
    end
  end

  def self.notes(records, file)
    CSV.open(file, 'wb', force_quotes: true) do |csv|
      records.each do |r|
        notes = r.notes
          .gsub(/\W+/, ' ')
          .gsub(/\r?\n+/, '')
          .downcase
          .strip

        next unless notes.present?

        csv << [notes]
      end
    end
  end
end
