# frozen_string_literal: true

class SeedClassifications < ActiveRecord::Migration[8.0]
  BUILT_INS = {
    oil_change: {
      name: "Oil Change",
      keywords: %w[engine oil motor oil change oil changed oil oil change oil changed]
    },
    tire_rotation: {
      name: "Tire Rotation",
      keywords: %w[tire rotation rotate tires rotate tyres]
    },
    air_filter: {
      name: "Air Filter",
      keywords: %w[air filter]
    },
    battery: {
      name: "Battery",
      keywords: %w[replace battery new battery]
    },
    brake_fluid: {
      name: "Brake Fluid",
      keywords: %w[brake fluid DOT]
    },
    brakes: {
      name: "Brakes",
      keywords: %w[brakes brake rotors brake pads rotors and pads rotors turned]
    },
    cabin_air_filter: {
      name: "Cabin Air Filter",
      keywords: %w[cabin air filter]
    },
    clutch: {
      name: "Clutch",
      keywords: %w[clutch clutch fluid]
    },
    coolant: {
      name: "Coolant",
      keywords: %w[coolant]
    },
    drive_belt: {
      name: "Drive Belt",
      keywords: %w[drive belt serpentine belt accessory belt timing belt belts new belt replaced belt]
    },
    power_steering: {
      name: "Power Steering",
      keywords: %w[power steering power steering oil power steering fluid]
    },
    spark_plugs: {
      name: "Spark Plugs",
      keywords: %w[spark plugs plug wires ngk]
    },
    transmission: {
      name: "Transmission",
      keywords: %w[gearbox oil transmission oil transmission fluid trans]
    }
  }.freeze

  def up
    BUILT_INS.each do |key, attrs|
      Classification.find_or_create_by!(key: key) do |c|
        c.name = attrs[:name]
        c.description = attrs[:keywords].join(", ")
        c.system = true
      end
    end
  end

  def down
    Classification.where(key: BUILT_INS.keys).destroy_all
  end
end
