# frozen_string_literal: true

class AddServiceScheduleIdToReminders < ActiveRecord::Migration[8.0]
  def change
    add_reference :reminders, :service_schedule, foreign_key: true, null: true
  end
end
