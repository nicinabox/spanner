# frozen_string_literal: true

class CreateShareLinks < ActiveRecord::Migration[8.0]
  def change
    create_table :share_links do |t|
      t.references :vehicle, null: false, foreign_key: true
      t.string :token, null: false

      t.timestamps
    end

    add_index :share_links, :token, unique: true
  end
end
