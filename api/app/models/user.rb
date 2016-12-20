class User < ApplicationRecord
  validates_presence_of :email

  has_many :vehicles, dependent: :destroy
  has_many :sessions, dependent: :destroy

  def user_id
    id
  end
end
