class User < ApplicationRecord
  has_many :vehicles, dependent: :destroy
  has_many :sessions, dependent: :destroy
end
