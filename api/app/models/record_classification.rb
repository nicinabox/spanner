# frozen_string_literal: true

class RecordClassification < ApplicationRecord
  belongs_to :record
  belongs_to :classification

  before_validation :set_defaults

  validates :classifier, :confidence, presence: true
  validates :classification_id, uniqueness: { scope: :record_id }

  private

  def set_defaults
    self.confidence ||= 1.0
  end
end
