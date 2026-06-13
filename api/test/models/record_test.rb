require 'test_helper'

class RecordTest < ActiveSupport::TestCase
  test "classify_notes on save" do
    vehicle = Vehicle.first || Vehicle.create!(name: "Test Vehicle", user: User.first)
    oil_changes = [
      "Changed oil with Mobil 1 5w-30 and new MANN filter",
      "Oil change with Castrol 5w30 and changed oil filter using bosch unit",
      "Change oil (5W30SYN), filter (R84712). "
    ]

    not_oil_changes = [
      "Replaced windshield wipers",
      "Washed and vacuumed car"
    ]

    records = [*oil_changes, *not_oil_changes].map do |notes|
      vehicle.records.create!(date: Date.today, notes: notes)
    end

    records.each do |record|
      is_oil_change = record.classifications.exists?(key: "oil_change")

      if oil_changes.include? record.notes
        assert is_oil_change, record.notes
      else
        assert_not is_oil_change, record.notes
      end
    end
  end
end
