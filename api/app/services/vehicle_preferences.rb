class VehiclePreferences
    include Virtus.model

    attribute :enable_cost, Boolean, :default => true
    attribute :send_reminder_emails, Boolean, :default => true
    attribute :send_prompt_for_records, Boolean, :default => true

    def self.dump(preferences)
        preferences.to_hash
    end

    def self.load(preferences)
        new(preferences)
    end
end
