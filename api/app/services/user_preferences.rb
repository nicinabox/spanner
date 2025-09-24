# frozen_string_literal: true

class UserPreferences
  include Virtus.model

  attribute :vehicles_sort_order, [String], default: %w[created_at desc]

  def self.dump(preferences)
    preferences.to_hash
  end

  def self.load(preferences)
    new(preferences)
  end
end
