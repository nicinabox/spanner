class AddFieldsToReminders < ActiveRecord::Migration[5.0]
  def change
    add_column :reminders, :mileage, :integer
    add_column :reminders, :reminder_type, :string
  end
end
