# frozen_string_literal: true

class AddLastReminderSentAtToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :last_reminder_sent_at, :datetime
  end
end
