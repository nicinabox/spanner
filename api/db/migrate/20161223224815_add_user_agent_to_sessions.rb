class AddUserAgentToSessions < ActiveRecord::Migration[5.0]
  def change
    add_column :sessions, :user_agent, :string
  end
end
