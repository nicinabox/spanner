class AddPromptSettingToVehicle < ActiveRecord::Migration[5.0]
  def change
    add_column :vehicles, :prompt_for_records, :bool, default: true
  end
end
