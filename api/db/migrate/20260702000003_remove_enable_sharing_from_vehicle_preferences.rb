# frozen_string_literal: true

class RemoveEnableSharingFromVehiclePreferences < ActiveRecord::Migration[8.0]
  def up
    # Remove enable_sharing key from hstore preferences for all vehicles
    # that have it set. For vehicles that had it enabled, create a share_link
    # for backward compatibility.
    Vehicle.where("preferences ? 'enable_sharing'").find_each do |vehicle|
      raw_prefs = vehicle[:preferences] || {}
      was_enabled = raw_prefs.delete('enable_sharing') == 'true'
      vehicle[:preferences] = raw_prefs
      vehicle.save!

      if was_enabled
        vehicle.share_links.create!(token: SecureRandom.urlsafe_base64(24))
      end
    end
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
