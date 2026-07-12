class AddDeferToServiceSchedules < ActiveRecord::Migration[8.0]
  def change
    add_column :service_schedules, :defer_delta_months, :integer
    add_column :service_schedules, :defer_delta_miles, :integer
  end
end
