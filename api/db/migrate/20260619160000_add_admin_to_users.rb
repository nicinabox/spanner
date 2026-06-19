# frozen_string_literal: true

class AddAdminToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :admin, :boolean, default: false, null: false unless column_exists?(:users, :admin)
  end
end