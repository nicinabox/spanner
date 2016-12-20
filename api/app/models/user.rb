class User < ApplicationRecord
  validates_presence_of :email

  has_many :vehicles, dependent: :destroy
  has_many :sessions, dependent: :destroy

  before_save { |user| user.email = user.email.downcase }

  def user_id
    id
  end
end
