class AddColorToVehicle < ActiveRecord::Migration[5.0]
  def change
    add_column :vehicles, :color, :string
  end
end
