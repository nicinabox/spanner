class User < ApplicationRecord
  has_many :vehicles, dependent: :destroy
  has_many :sessions, dependent: :destroy

  validates_presence_of :email

  def user_id
    id
  end
end
