class AddDistanceUnitToVehicles < ActiveRecord::Migration[5.0]
  def change
    add_column :vehicles, :distance_unit, :string, default: 'mi'
  end
end
