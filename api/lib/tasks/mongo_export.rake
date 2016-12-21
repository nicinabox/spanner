namespace :mongo do
  collections = %w[users vehicles records reminders]

  def parse_collection(name)
    contents = File.read("#{name}.json")
    contents.split("\n").map do |line|
      JSON.parse(line)
    end
  end

  desc 'Export mongo collections'
  task export: :environment do |t|
    collections.each do |name|
      puts "Exporting #{name}..."
      `mongoexport --db spanner-export --collection #{name} --out #{name}.json`
    end
    puts "Done"
  end

  desc 'Import mongo json collections'
  task import: :environment do |t|
    parse_collection('users').each do |data|
      user = User.find_or_create_by!(
        mongo_id: data["_id"]["$oid"],
        email: data["email"]
      )

      puts "=> #{user.email}"
    end

    parse_collection('vehicles').each do |data|
      user = User.where(mongo_id: data["user"]).first

      vehicle = user.vehicles.find_or_create_by!(
        mongo_id: data["_id"]["$oid"],
        name: data["name"],
        vin: data["vin"],
        notes: data["notes"],
        retired: data["settings"]["retired"],
        enable_cost: data["settings"]["enableCost"],
        position: data["position"],
        user: user
      )

      puts "=> #{vehicle.name} for #{user.email}"
    end

    parse_collection('reminders').each do |data|
      vehicle = Vehicle.where(mongo_id: data["vehicleId"]["$oid"]).first

      reminder = vehicle.reminders.find_or_create_by!(
        mongo_id: data["_id"]["$oid"],
        notes: data["reminder"],
      )

      puts "=> #{reminder.notes} for #{vehicle.name}"
    end

    parse_collection('records').each do |data|
      vehicle = Vehicle.where(mongo_id: data["vehicleId"]["$oid"]).first

      record = vehicle.records.find_or_create_by!(
        mongo_id: data["_id"]["$oid"],
        notes: data["notes"],
        mileage: data["mileage"],
        cost: data["cost"],
        date: data["date"]["$date"]
      )

      puts "=> #{record.notes} for #{vehicle.name}"
    end
  end
end
