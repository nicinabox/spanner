# frozen_string_literal: true

# Demo seed for screenshots and exploration. Idempotent: re-running clears
# existing demo data and recreates it. Run with `rails db:seed`.
#
# Demo login:
#   email:    demo@spanner.app
#   password: demo-demo-demo
#   (magic link also works)

demo_email = "demo@spanner.app"

# Hard-delete any prior demo users (including soft-deleted) so the email
# unique constraint doesn't block reseeding.
User.unscoped.where(email: demo_email).delete_all

user = User.create!(
  email: demo_email,
  password: "demo-demo-demo",
  preferences: { "send_reminder_emails" => true },
)

# ----------------------------------------------------------------------------
# Daily driver - 1990 Mazda Miata (NA generation)
# ----------------------------------------------------------------------------

miata = Vehicle.create!(
  user: user,
  name: "Miata",
  vin: "JM1NA3517L0123456",
  distance_unit: "mi",
  color: "#dc2626",
  position: 0,
  preferences: {
    "enable_cost" => true,
    "send_reminder_emails" => true,
  },
)

oil = Classification.create!(vehicle: miata, name: "Oil change", keywords: %w[oil filter lube])
tires = Classification.create!(vehicle: miata, name: "Tire rotation", keywords: %w[tires rotate])
brakes = Classification.create!(vehicle: miata, name: "Brake service", keywords: %w[brakes pads rotors])
timing = Classification.create!(vehicle: miata, name: "Timing belt", keywords: %w[timing belt])
inspection = Classification.create!(vehicle: miata, name: "Inspection", keywords: %w[inspection safety])

records = [
  { date: "2024-03-15", mileage: 142_800, cost: 65.00, notes: "Oil change - 10W-30 conventional", classifications: [oil] },
  { date: "2024-06-22", mileage: 144_900, cost: 35.00, notes: "Tire rotation, pressure check (29 psi)", classifications: [tires] },
  { date: "2024-08-10", mileage: 145_700, cost: 12.00, notes: "Replaced cabin air filter" },
  { date: "2024-10-05", mileage: 146_900, cost: 285.00, notes: "Front brake pads and rotors, new fluid", classifications: [brakes] },
  { date: "2024-12-12", mileage: 148_200, cost: 70.00, notes: "Oil change and coolant top-off", classifications: [oil] },
  { date: "2025-02-08", mileage: 149_400, cost: 0, notes: "State safety inspection passed", classifications: [inspection] },
  { date: "2025-04-19", mileage: 151_100, cost: 68.00, notes: "Oil change", classifications: [oil] },
  { date: "2025-07-04", mileage: 153_500, cost: 35.00, notes: "Tire rotation", classifications: [tires] },
  { date: "2025-09-22", mileage: 155_800, cost: 72.00, notes: "Oil change, adjusted valve clearances", classifications: [oil] },
]

records.each do |r|
  rec = Record.create!(
    vehicle: miata,
    date: r[:date],
    mileage: r[:mileage],
    cost: r[:cost],
    notes: r[:notes],
  )
  r[:classifications]&.each do |c|
    RecordClassification.create!(
      record: rec,
      classification: c,
      classifier: "manual",
      confidence: 1.0,
      auto_tagged: false,
    )
  end
end

ServiceSchedule.create!(vehicle: miata, classification: oil, distance_interval: 3000)
ServiceSchedule.create!(vehicle: miata, classification: tires, distance_interval: 5000, month_interval: 6)
ServiceSchedule.create!(vehicle: miata, classification: timing, distance_interval: 60_000, month_interval: 84)
ServiceSchedule.create!(vehicle: miata, classification: inspection, month_interval: 12)

Reminder.create!(vehicle: miata, notes: "Registration renewal", reminder_type: "date", date: "2026-03-15")
Reminder.create!(vehicle: miata, notes: "Replace convertible top seals", reminder_type: "mileage", mileage: 158_000)

# ----------------------------------------------------------------------------
# Weekend - 1981 Yamaha SR500
# ----------------------------------------------------------------------------

sr500 = Vehicle.create!(
  user: user,
  name: "SR500",
  vin: "JYA2LHO07BA001234",
  distance_unit: "mi",
  color: "#1f2937",
  position: 1,
  preferences: {
    "enable_cost" => false,
    "send_reminder_emails" => true,
  },
)

chain = Classification.create!(vehicle: sr500, name: "Chain maintenance", keywords: %w[chain lube adjust])
oil_b = Classification.create!(vehicle: sr500, name: "Oil change", keywords: %w[oil])
carbs = Classification.create!(vehicle: sr500, name: "Carburetor service", keywords: %w[carb carbs float])

bike_records = [
  { date: "2024-05-12", mileage: 18_400, notes: "Spring tune-up: oil, chain adjust and lube", classifications: [oil_b, chain] },
  { date: "2024-09-03", mileage: 19_800, notes: "Chain clean and lube, checked spoke tension", classifications: [chain] },
  { date: "2025-05-18", mileage: 21_500, notes: "Oil change, cleaned and synced carburetors", classifications: [oil_b, carbs] },
]

bike_records.each do |r|
  rec = Record.create!(vehicle: sr500, date: r[:date], mileage: r[:mileage], notes: r[:notes])
  r[:classifications]&.each do |c|
    RecordClassification.create!(
      record: rec, classification: c,
      classifier: "manual", confidence: 1.0, auto_tagged: false,
    )
  end
end

ServiceSchedule.create!(vehicle: sr500, classification: chain, distance_interval: 500)
ServiceSchedule.create!(vehicle: sr500, classification: oil_b, distance_interval: 1500)

Reminder.create!(vehicle: sr500, notes: "Winter storage prep", reminder_type: "date", date: "2025-11-01")

# ----------------------------------------------------------------------------
# Boat - retired, kept for history
# ----------------------------------------------------------------------------

boat = Vehicle.create!(
  user: user,
  name: "Sailfish",
  vin: nil,
  distance_unit: "hr",
  color: "#0ea5e9",
  position: 2,
  retired: true,
  preferences: {},
)

winterize = Classification.create!(vehicle: boat, name: "Winterization", keywords: %w[winterize antifreeze])

boat_records = [
  { date: "2022-10-08", mileage: 320, cost: 180.00, notes: "Fall winterization", classifications: [winterize] },
  { date: "2023-05-15", mileage: 325, cost: 95.00, notes: "Spring launch" },
  { date: "2023-09-20", mileage: 380, cost: 220.00, notes: "End of season service", classifications: [winterize] },
]

boat_records.each do |r|
  rec = Record.create!(vehicle: boat, date: r[:date], mileage: r[:mileage], cost: r[:cost], notes: r[:notes])
  r[:classifications]&.each do |c|
    RecordClassification.create!(
      record: rec, classification: c,
      classifier: "manual", confidence: 1.0, auto_tagged: false,
    )
  end
end

puts "Seeded demo user: #{demo_email}"
puts "Vehicles: #{Vehicle.where(user: user).count}, Records: #{Record.joins(:vehicle).where(vehicles: { user_id: user.id }).count}"
