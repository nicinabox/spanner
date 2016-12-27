require 'test_helper'

class VehicleTest < ActiveSupport::TestCase
  test "miles_per_day" do
    vehicle = Vehicle.first
    assert_equal 99.97, vehicle.miles_per_day.round(2)
  end

  test "miles_per_year" do
    vehicle = Vehicle.first
    assert_equal 36487, vehicle.miles_per_year
  end
end
