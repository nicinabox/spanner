class CreateReminders < ActiveRecord::Migration[5.0]
  def change
    create_table :reminders do |t|
      t.belongs_to :vehicle, index: true

      t.string :reminder
      t.integer :vehicle_id

      t.timestamps
    end
  end
end
