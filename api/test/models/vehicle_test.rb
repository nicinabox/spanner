require 'test_helper'

class VehicleTest < ActiveSupport::TestCase
  test "miles_per_day" do
    vehicle = Vehicle.first
    assert_equal 99, vehicle.miles_per_day
  end

  test "miles_per_year" do
    vehicle = Vehicle.first
    assert_equal 4050, vehicle.miles_per_year
  end
end
