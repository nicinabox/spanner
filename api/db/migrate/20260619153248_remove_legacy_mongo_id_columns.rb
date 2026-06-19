# frozen_string_literal: true

class RemoveLegacyMongoIdColumns < ActiveRecord::Migration[8.0]
  def change
    remove_column :users, :mongo_id, :string
    remove_column :vehicles, :mongo_id, :string
    remove_column :records, :mongo_id, :string
    remove_column :reminders, :mongo_id, :string
  end
end