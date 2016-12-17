class User < ApplicationRecord
  has_many :vehicles, dependent: :destroy
end
