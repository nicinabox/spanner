# frozen_string_literal: true

class RenameMileageIntervalToDistanceInterval < ActiveRecord::Migration[8.0]
  def change
    rename_column :service_schedules, :mileage_interval, :distance_interval
  end
end