class Session < ApplicationRecord
  belongs_to :user
  delegate :email, :user_id, to: :user
end
