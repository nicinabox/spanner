class AddDateToReminders < ActiveRecord::Migration[5.0]
  def change
    add_column :reminders, :date, :datetime
  end
end
