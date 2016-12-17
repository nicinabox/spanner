class AddTokensToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :login_token, :string
    add_column :users, :login_token_valid_until, :datetime
    add_column :users, :auth_token, :string
    add_column :users, :auth_token_valid_until, :datetime
  end
end
