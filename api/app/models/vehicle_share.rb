# frozen_string_literal: true

class VehicleShare < ApplicationRecord
  belongs_to :vehicle
  belongs_to :user
  belongs_to :invited_by, class_name: 'User'

  validates :vehicle_id, uniqueness: { scope: :user_id, message: 'already shared with this user' }

  scope :pending, -> { where(accepted_at: nil) }
  scope :accepted, -> { where.not(accepted_at: nil) }

  def accept!
    update!(accepted_at: Time.current)
  end

  def accepted?
    accepted_at.present?
  end

  def pending?
    !accepted?
  end
end
