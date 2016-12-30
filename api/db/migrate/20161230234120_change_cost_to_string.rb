class ChangeCostToString < ActiveRecord::Migration[5.0]
  def change
    change_column :records, :cost, :string
  end
end
