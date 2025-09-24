# frozen_string_literal: true

class Record < ApplicationRecord
  validates :notes, :date, presence: true
  validate :mileage_greater_than_trailing_record
  validate :mileage_less_than_leading_record

  belongs_to :vehicle

  default_scope { order(date: :asc, id: :asc) }

  after_update :update_mileage_reminders
  after_destroy :update_mileage_reminders
  after_save :update_mileage_reminders

  def mileage_greater_than_trailing_record
    return if mileage.nil? || mileage.zero?

    trailing_record = vehicle.records
                             .where(date: ...date)
                             .where('mileage > ?', 0)
                             .where.not(id: id)
                             .last

    return unless trailing_record && mileage < trailing_record.mileage

    errors.add(:mileage, "must be greater than #{trailing_record.mileage.to_i} on this date")
  end

  def mileage_less_than_leading_record
    return if mileage.nil? || mileage.zero?

    leading_record = vehicle.records
                            .where('date > ?', date)
                            .where('mileage > ?', 0)
                            .where.not(id: id)
                            .first

    return unless leading_record && mileage > leading_record.mileage

    errors.add(:mileage, "must be less than #{leading_record.mileage.to_i}")
  end

  def update_mileage_reminders
    vehicle.reminders.each(&:save)
  end

  def oil_change?
    match_notes [
      'engine oil',
      'motor oil',
      'change oil',
      'changed oil',
      'oil change',
      'oil changed'
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
      'power steering fluid'
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
      'trans'
    ]
  end

  private

  def match_notes(tokens)
    fragments = notes.split(',;.')

    fragments.any? do |_fragment|
      tokens.any? do |token|
        notes.match(/#{token}/i)
      end
    end
  end
end
