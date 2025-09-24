require Rails.root.join('app/types/user_preferences_type')
require Rails.root.join('app/types/vehicle_preferences_type')

ActiveRecord::Type.register(:user_preferences, UserPreferencesType)
ActiveRecord::Type.register(:vehicle_preferences, VehiclePreferencesType)
