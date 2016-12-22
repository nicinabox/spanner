class AddAuthTokenValidUntilToSessions < ActiveRecord::Migration[5.0]
  def change
    add_column :sessions, :auth_token_valid_until, :datetime
  end
end
