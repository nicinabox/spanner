# frozen_string_literal: true

class CreateVehicleShares < ActiveRecord::Migration[8.0]
  def change
    create_table :vehicle_shares do |t|
      t.references :vehicle, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.references :invited_by, null: false, foreign_key: { to_table: :users }
      t.datetime :accepted_at

      t.timestamps
    end

    add_index :vehicle_shares, [:vehicle_id, :user_id], unique: true
  end
end
