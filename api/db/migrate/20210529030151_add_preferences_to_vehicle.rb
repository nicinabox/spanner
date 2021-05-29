class AddPreferencesToVehicle < ActiveRecord::Migration[5.0]
  def change
    enable_extension "hstore"
    add_column :vehicles, :preferences, :hstore
    add_index :vehicles, :preferences, using: :gin
  end
end
