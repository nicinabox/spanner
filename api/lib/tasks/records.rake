require 'exporter'
require 'importer'

namespace :records do
  desc "Export vehicle records"
  task :export, [:vehicle_id] => :environment do |t, args|
    vehicle = Vehicle.find(args.vehicle_id)
    Exporter.records(vehicle)
  end

  desc "Import vehicle records"
  task :import, [:file, :vehicle_id] => :environment do |t, args|
    vehicle = Vehicle.find(args.vehicle_id)
    Importer.records(vehicle, File.read(args.file))
  end

  desc "Import vehicle records from Fuelly export"
  task :fuelly, [:file, :vehicle_id] => :environment do |t, args|
    vehicle = Vehicle.find(args.vehicle_id)
    Importer.fuelly(vehicle, File.read(args.file))
  end
end
