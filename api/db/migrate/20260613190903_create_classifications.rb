class CreateClassifications < ActiveRecord::Migration[8.0]
  def change
    create_table :classifications do |t|
      t.string :key, null: false
      t.string :name, null: false
      t.text :description
      t.boolean :system, null: false, default: true
      t.integer :default_mileage_interval
      t.integer :default_month_interval

      t.timestamps
    end

    add_index :classifications, :key, unique: true
  end
end
