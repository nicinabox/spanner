class AddMongoIds < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :mongo_id, :string
    add_column :vehicles, :mongo_id, :string
    add_column :records, :mongo_id, :string
    add_column :reminders, :mongo_id, :string
  end
end
