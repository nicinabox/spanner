class Vehicle < ApplicationRecord
  validates_presence_of :name

  belongs_to :user
  has_many :reminders, dependent: :destroy
  has_many :records, dependent: :destroy
end
