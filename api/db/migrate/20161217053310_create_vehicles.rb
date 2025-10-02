class CreateVehicles < ActiveRecord::Migration[5.0]
  def change
    create_table :vehicles do |t|
      t.belongs_to :user, index: true

      t.string :name
      t.string :vin
      t.string :notes
      t.integer :position
      t.boolean :enable_cost
      t.boolean :retired
      t.integer :user_id

      t.timestamps
    end
  end
end
