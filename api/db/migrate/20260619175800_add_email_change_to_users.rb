# frozen_string_literal: true

class AddEmailChangeToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :unconfirmed_email, :string
    add_column :users, :email_confirmation_token, :string
    add_column :users, :email_confirmation_token_valid_until, :datetime
    add_index :users, :email_confirmation_token
  end
end