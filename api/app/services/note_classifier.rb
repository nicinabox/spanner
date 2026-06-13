# frozen_string_literal: true

class NoteClassifier
  def self.classify(text)
    new.classify(text)
  end

  def classify(_text)
    raise NotImplementedError
  end
end
