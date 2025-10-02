class AddReminderDateToReminders < ActiveRecord::Migration[5.0]
  def change
    add_column :reminders, :reminder_date, :date
  end
end
