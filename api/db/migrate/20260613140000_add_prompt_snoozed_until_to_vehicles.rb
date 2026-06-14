# frozen_string_literal: true

class AddPromptSnoozedUntilToVehicles < ActiveRecord::Migration[8.0]
  def change
    add_column :vehicles, :prompt_snoozed_until, :datetime
  end
end
