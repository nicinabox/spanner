# frozen_string_literal: true

class Classification < ApplicationRecord
  validates :key, presence: true, uniqueness: true, if: -> { system? }
  validates :key, format: { with: /\A[a-z0-9_]+\z/ }, allow_nil: true
  validates :name, presence: true
  validates :name, uniqueness: { scope: :vehicle_id }, if: -> { vehicle_id.present? }

  belongs_to :vehicle, optional: true
  belongs_to :user, optional: true

  has_many :record_classifications, dependent: :destroy
  has_many :records, through: :record_classifications
  has_many :service_schedules, dependent: :restrict_with_error

  scope :system, -> { where(system: true) }
  scope :for_vehicle, ->(vehicle) { where(vehicle_id: [nil, vehicle.id]) }
end
