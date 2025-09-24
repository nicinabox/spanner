class VehiclePreferencesType < ActiveRecord::Type::Value
  def cast(value)
    case value
    when VehiclePreferences
      value
    when Hash
      VehiclePreferences.new(value)
    when String
      begin
        VehiclePreferences.new(JSON.parse(value))
      rescue JSON::ParserError
        VehiclePreferences.new({})
      end
    else
      VehiclePreferences.new({})
    end
  end

  def serialize(value)
    value.is_a?(VehiclePreferences) ? value.to_hash : value
  end
end
