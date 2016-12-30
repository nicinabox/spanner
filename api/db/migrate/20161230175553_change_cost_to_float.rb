class ChangeCostToFloat < ActiveRecord::Migration[5.0]
  def change
    change_column :records, :cost, :float
    change_column :records, :mileage, :float
  end
end
