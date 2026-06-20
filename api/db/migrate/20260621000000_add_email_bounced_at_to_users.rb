# frozen_string_literal: true

class AddEmailBouncedAtToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :email_bounced_at, :datetime
  end
end