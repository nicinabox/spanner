# frozen_string_literal: true

class Session < ApplicationRecord
  belongs_to :user

  default_scope { order(last_seen: :asc) }

  scope :expired, -> { where(auth_token_valid_until: ...Time.zone.now) }
  scope :active, -> { where('auth_token_valid_until > ?', Time.zone.now) }

  delegate :email, :user_id, to: :user
end
