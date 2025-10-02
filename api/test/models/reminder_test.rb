require 'test_helper'
require "minitest/mock"

class ReminderTest < ActiveSupport::TestCase
  test "estimate_date" do
    vehicle = Vehicle.new
    vehicle.stub :miles_per_day, 22 do
      vehicle.stub :estimated_mileage, 3800 do
        reminder = Reminder.new(
          notes: 'change oil',
          mileage: 5000,
          reminder_type: 'mileage',
          vehicle: vehicle
        )

        days = (5000 - vehicle.estimated_mileage) / vehicle.miles_per_day
        assert_equal reminder.estimate_date, Date.today + days.days
      end
    end
  end
end
