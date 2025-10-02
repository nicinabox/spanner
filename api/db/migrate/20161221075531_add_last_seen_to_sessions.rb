class AddLastSeenToSessions < ActiveRecord::Migration[5.0]
  def change
    add_column :sessions, :last_seen, :datetime
  end
end
