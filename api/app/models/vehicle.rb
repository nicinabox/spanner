class Vehicle < ApplicationRecord
  belongs_to :user
  has_many :reminders, dependent: :destroy
  has_many :records, dependent: :destroy
end
