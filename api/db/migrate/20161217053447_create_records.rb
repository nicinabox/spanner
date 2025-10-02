class CreateRecords < ActiveRecord::Migration[5.0]
  def change
    create_table :records do |t|
      t.belongs_to :vehicle, index: true

      t.datetime :date
      t.integer :cost
      t.integer :mileage
      t.text :notes
      t.integer :vehicle_id

      t.timestamps
    end
  end
end
