class Reminder < ApplicationRecord
  validates_presence_of :notes

  belongs_to :vehicle
end
