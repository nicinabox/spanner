# frozen_string_literal: true

class RecordClassification < ApplicationRecord
  belongs_to :record
  belongs_to :classification

  before_validation :set_defaults

  validates :classifier, :confidence, presence: true
  validates :classification_id, uniqueness: { scope: :record_id }

  scope :auto_tagged, -> { where(auto_tagged: true) }

  private

  def set_defaults
    self.confidence ||= 1.0
    self.auto_tagged = true if auto_tagged.nil?
  end
end
