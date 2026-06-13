# frozen_string_literal: true

class Classification < ApplicationRecord
  validates :key, presence: true, uniqueness: true
  validates :key, format: { with: /\A[a-z0-9_]+\z/ }
  validates :name, presence: true

  has_many :record_classifications, dependent: :destroy
  has_many :records, through: :record_classifications

  scope :system, -> { where(system: true) }
end
