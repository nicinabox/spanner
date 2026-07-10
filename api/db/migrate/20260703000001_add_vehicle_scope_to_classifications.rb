# frozen_string_literal: true

class AddVehicleScopeToClassifications < ActiveRecord::Migration[8.0]
  def change
    add_reference :classifications, :vehicle, foreign_key: true, null: true
    add_reference :classifications, :user, foreign_key: true, null: true
    add_column :classifications, :keywords, :text, array: true, default: []

    remove_column :classifications, :default_mileage_interval, :integer
    remove_column :classifications, :default_month_interval, :integer

    add_index :classifications, %i[vehicle_id name],
              unique: true,
              where: "vehicle_id IS NOT NULL",
              name: "index_classifications_on_vehicle_id_and_name"
  end
end