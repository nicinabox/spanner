class Session < ApplicationRecord
  belongs_to :user
  default_scope { order(last_seen: :asc) }
  delegate :email, :user_id, to: :user
end
