class Record < ApplicationRecord
  validates_presence_of :notes, :date

  belongs_to :vehicle

  def oil_change?
    match_notes [
      'engine oil',
      'motor oil',
      'change oil',
      'changed oil',
      'oil change',
      'oil changed',
    ]
  end

  def tire_rotation?
    match_notes [
      'tire rotation',
      'rotate tires',
      'rotate tyres'
    ]
  end

  def air_filter?
    match_notes [
      'air filter'
    ]
  end

  def battery?
    match_notes [
      'replace battery',
      'new battery'
    ]
  end

  def brake_fluid?
    match_notes [
      'brake fluid',
      'DOT'
    ]
  end

  def brakes?
    match_notes [
      'brakes',
      'brake rotors',
      'brake pads',
      'rotors and pads',
      'rotors turned'
    ]
  end

  def cabin_air_filter?
    match_notes [
      'cabin air filter'
    ]
  end

  def clutch?
    match_notes [
      'clutch',
      'clutch fluid'
    ]
  end

  def coolant?
    match_notes [
      'coolant'
    ]
  end

  def drive_belt?
    match_notes [
      'drive belt',
      'serpentine belt',
      'accessory belt',
      'timing belt',
      'belts',
      'new belt',
      'replaced belt'
    ]
  end

  def power_steering?
    match_notes [
      'power steering',
      'power steering oil',
      'power steering fluid',
    ]
  end

  def spark_plugs?
    match_notes [
      'spark plugs',
      'plug wires',
      'ngk'
    ]
  end

  def transmission?
    match_notes [
      'gearbox oil',
      'transmission oil',
      'transmission fluid',
      'trans',
    ]
  end

  private

  def match_notes(tokens)
    fragments = notes.split /,;\./

    fragments.any? do |fragment|
      tokens.any? do |token|
        notes.match /#{token}/i
      end
    end
  end
end
