# frozen_string_literal: true

class AddNextDueToServiceSchedules < ActiveRecord::Migration[8.0]
  def change
    add_column :service_schedules, :next_due_date, :date
    add_column :service_schedules, :next_due_mileage, :integer
  end
end
