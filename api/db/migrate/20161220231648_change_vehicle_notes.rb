class ChangeVehicleNotes < ActiveRecord::Migration[5.0]
  def change
    change_column :vehicles, :notes, :text
  end
end
