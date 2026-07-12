# frozen_string_literal: true

class Vehicle < ApplicationRecord
  store_accessor :preferences

  validates :name, presence: true

  belongs_to :user
  has_many :reminders, dependent: :destroy
  has_many :records, dependent: :destroy
  has_many :service_schedules, dependent: :destroy
  has_many :classifications, dependent: :destroy

  default_scope { order(position: :asc, id: :asc) }

  def preferences
    @preferences ||= VehiclePreferences.new(self[:preferences] || {})
  end

  def preferences=(value)
    # Accepts either a VehiclePreferences object or a hash
    prefs_hash = value.is_a?(VehiclePreferences) ? value.to_hash : value
    self[:preferences] = prefs_hash
    @preferences = VehiclePreferences.new(prefs_hash)
  end

  def prompt_for_first_record!
    return if !preferences.send_prompt_for_records || records.any?

    PromptUserMailer.add_first_record(user, self).deliver_later
  end

  def prompt_for_new_record!
    return unless preferences.send_prompt_for_records
    return unless user.reminder_eligible?

    date = estimated_next_record_date
    return unless date && (date <= Time.zone.today.beginning_of_day)

    PromptUserMailer.add_record(user, self).deliver_later
  end

  def squish_vin
    return unless vin? && vin.size > 10

    vin[0..7] + vin[9..10]
  end

  delegate :estimated_mileage, to: :projection

  delegate :estimated_next_record_date, to: :projection

  delegate :miles_per_day, to: :projection

  delegate :miles_per_year, to: :projection

  private

  def projection
    @projection ||= MileageProjection.estimate(record_pairs, as_of: Time.zone.today)
  end

  def record_pairs
    records.unscope(:order).where.not(mileage: nil)
      .limit(MileageProjection::RECORD_LIMIT).order(date: :desc)
      .pluck(:date, :mileage)
      .map { |date, mileage| [date.to_date, mileage.to_f] }
  end
end
