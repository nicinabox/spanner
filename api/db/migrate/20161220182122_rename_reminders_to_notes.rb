class RenameRemindersToNotes < ActiveRecord::Migration[5.0]
  def change
    rename_column :reminders, :reminder, :notes
  end
end
