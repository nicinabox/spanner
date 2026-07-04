class AddMissingSystemClassifications < ActiveRecord::Migration[8.0]
  def up
    classifications = [
      { key: 'chain_adjustment', name: 'Chain Adjustment' },
      { key: 'chain_replacement', name: 'Chain Replacement' },
      { key: 'tire_replacement', name: 'Tire Replacement' },
      { key: 'hull_cleaning', name: 'Hull Cleaning' },
      { key: 'zinc_replacement', name: 'Zinc Replacement' },
      { key: 'impeller_service', name: 'Impelor Service' },
      { key: 'fuel_filter', name: 'Fuel Filter' },
      { key: 'bilge_pump', name: 'Bilge Pump' },
      { key: 'safety_gear', name: 'Safety Gear' },
      { key: 'generator_service', name: 'Generator Service' },
      { key: 'propane_system', name: 'Propane System' },
      { key: 'roof_inspection', name: 'Roof Inspection' },
      { key: 'tire_inspection', name: 'Tire Inspection' }
    ]

    classifications.each do |attrs|
      next if Classification.exists?(key: attrs[:key])

      Classification.create!(attrs.merge(system: true))
    end
  end

  def down
    Classification.where(key: %w[
      chain_adjustment chain_replacement tire_replacement
      hull_cleaning zinc_replacement impeller_service fuel_filter
      bilge_pump safety_gear generator_service propane_system
      roof_inspection tire_inspection
    ]).destroy_all
  end
end
