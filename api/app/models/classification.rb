# frozen_string_literal: true

class Classification < ApplicationRecord
  validates :name, presence: true
  validates :name, uniqueness: { scope: :vehicle_id }
  validates :keywords, presence: true

  belongs_to :vehicle, optional: false

  has_many :record_classifications, dependent: :destroy
  has_many :records, through: :record_classifications
  has_many :service_schedules, dependent: :restrict_with_error
end
