# frozen_string_literal: true

class ServiceSchedule < ApplicationRecord
  belongs_to :vehicle
  belongs_to :classification
  has_one :reminder, dependent: :destroy

  # rubocop:disable Rails/RedundantPresenceValidationOnBelongsTo
  validates :vehicle, presence: true
  validates :classification, presence: true
  # rubocop:enable Rails/RedundantPresenceValidationOnBelongsTo
  validate :at_least_one_interval

  private

  def at_least_one_interval
    return if mileage_interval.present? || month_interval.present?

    errors.add(:base, 'at least one of mileage_interval or month_interval must be present')
  end
end
