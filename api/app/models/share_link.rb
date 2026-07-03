# frozen_string_literal: true

class ShareLink < ApplicationRecord
  belongs_to :vehicle

  validates :token, presence: true, uniqueness: true

  before_validation :generate_token, on: :create

  def to_param
    token
  end

  private

  def generate_token
    self.token ||= SecureRandom.urlsafe_base64(24)
  end
end
