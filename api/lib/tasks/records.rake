# frozen_string_literal: true

require 'exporter'
require 'importer'

namespace :records do
  desc 'Export vehicle records'
  task :export, [:vehicle_id] => :environment do |_t, args|
    vehicle = Vehicle.find(args.vehicle_id)
    Exporter.records(vehicle)
  end

  desc 'Import vehicle records'
  task :import, %i[file vehicle_id] => :environment do |_t, args|
    vehicle = Vehicle.find(args.vehicle_id)
    Importer.records(vehicle, File.read(args.file))
  end

  desc 'Import vehicle records from Fuelly export'
  task :fuelly, %i[file vehicle_id] => :environment do |_t, args|
    vehicle = Vehicle.find(args.vehicle_id)
    Importer.fuelly(vehicle, File.read(args.file))
  end
end
