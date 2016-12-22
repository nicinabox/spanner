require 'test_helper'

class RecordTest < ActiveSupport::TestCase
  test "is_oil_change?" do
    oil_changes = [
      "Changed oil with Mobil 1 5w-30 and new MANN filter",
      "Oil change with Castrol 5w30 and changed oil filter using bosch unit",
      "Change oil (5W30SYN), filter (R84712). ",
      "Dealership changed oil, brake fluid, front left ball joint. Small oil leak was noticed from V TEC solenoid. Axle shaft i
s leaking a little too, but not a problem at the moment. ",
      "Power steering pump replaced; engine oil changed."
    ]

    not_oil_changes = [
      "Replaced oil filter housing gasket, oil vanos line and fan clutch",
      "Supercharger oil service; Cravenspeed 15%; DT BPV; REPLACED: water pump o-ring; crankshaft position sensor o-ring; s-belt (Gates PN: 060535); belt tensioner (ACDelco PN: 38404); idler pulley (ACDelco PN: 36168); fog light bulbs (Optilux H71071132 XY Series). CLEANED: intercooler; supercharger; supercharger horns; water pump housing; throttle body; front of lower block; brake calipers.",
    ]

    records = [*oil_changes, *not_oil_changes].map { |notes| Record.new(notes: notes) }

    records.each do |record|
      if oil_changes.include? record.notes
        assert record.is_oil_change?, record.notes
      else
        assert !record.is_oil_change?, record.notes
      end
    end
  end
end
