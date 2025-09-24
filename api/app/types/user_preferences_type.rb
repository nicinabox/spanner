class UserPreferencesType < ActiveRecord::Type::Value
  def cast(value)
    case value
    when UserPreferences
      value
    when Hash
      UserPreferences.new(value)
    when String
      begin
        UserPreferences.new(JSON.parse(value))
      rescue JSON::ParserError
        UserPreferences.new({})
      end
    else
      UserPreferences.new({})
    end
  end

  def serialize(value)
    value.is_a?(UserPreferences) ? value.to_hash : value
  end
end
