# frozen_string_literal: true

class CreateServiceSchedules < ActiveRecord::Migration[8.0]
  def change
    create_table :service_schedules do |t|
      t.references :vehicle, null: false, foreign_key: true
      t.references :classification, null: false, foreign_key: true
      t.integer :mileage_interval
      t.integer :month_interval
      t.text :notes
      t.boolean :enabled, null: false, default: true
      t.references :last_completed_record, foreign_key: { to_table: :records }, null: true

      t.timestamps
    end

    add_index :service_schedules, %i[vehicle_id classification_id], unique: true
  end
end
