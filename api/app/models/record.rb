class Record < ApplicationRecord
  validates_presence_of :notes, :date

  belongs_to :vehicle
end
