class Record < ApplicationRecord
  validates_presence_of :notes, :date

  belongs_to :vehicle

  def is_oil_change?
    match_notes [
      'engine oil',
      'motor oil',
      'change oil',
      'changed oil',
      'oil change',
      'oil changed',
    ]
  end

  private

  def match_notes(tokens)
    fragments = notes.split /,;\./

    fragments.any? do |fragment|
      tokens.any? do |token|
        notes.match /#{token}/i
      end
    end
  end
end
