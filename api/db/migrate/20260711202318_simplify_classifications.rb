# frozen_string_literal: true

class SimplifyClassifications < ActiveRecord::Migration[8.0]
  def up
    # Load preset keywords for backfill
    preset_keywords = {}
    Dir[Rails.root.join('config/presets/*.yml')].each do |path|
      YAML.safe_load_file(path, permitted_classes: [Symbol])['items']&.each do |item|
        preset_keywords[item['name']] = item['keywords']
      end
    end

    # Backfill keywords for system classifications that have none
    Classification.where(system: true, keywords: []).find_each do |c|
      kw = preset_keywords[c.name]
      c.update_column(:keywords, kw) if kw
    end

    # Convert system classifications with service schedules to vehicle-specific.
    # A system classification may have schedules for multiple vehicles, so we
    # create a copy per vehicle and reassign.
    Classification.where(system: true, id: ServiceSchedule.select(:classification_id)).find_each do |c|
      vehicle_ids = ServiceSchedule.where(classification_id: c.id).distinct.pluck(:vehicle_id)

      vehicle_ids.each do |vid|
        # Check if vehicle already has a classification with this name
        existing = Classification.find_by(name: c.name, vehicle_id: vid)

        if existing
          # Remove duplicate schedules before reassigning
          ServiceSchedule.where(classification_id: c.id, vehicle_id: vid).find_each do |s|
            if ServiceSchedule.exists?(classification_id: existing.id, vehicle_id: vid)
              s.destroy!
            else
              s.update_column(:classification_id, existing.id)
            end
          end

          # Reassign record classifications (skip if already assigned)
          RecordClassification.where(classification_id: c.id)
                              .joins(:record)
                              .where(records: { vehicle_id: vid })
                              .where.not(record_id: RecordClassification.where(classification_id: existing.id).select(:record_id))
                              .update_all(classification_id: existing.id)
        else
          copy = Classification.create!(
            name: c.name,
            keywords: c.keywords.presence || preset_keywords[c.name] || ['unknown'],
            vehicle_id: vid
          )

          ServiceSchedule.where(classification_id: c.id, vehicle_id: vid).update_all(classification_id: copy.id)

          RecordClassification.where(classification_id: c.id)
                              .joins(:record)
                              .where(records: { vehicle_id: vid })
                              .update_all(classification_id: copy.id)
        end
      end
    end

    # Delete remaining system classifications that have no schedules
    orphaned = Classification.where(system: true).where.not(id: ServiceSchedule.select(:classification_id))
    RecordClassification.where(classification_id: orphaned).delete_all
    orphaned.delete_all

    # Drop columns
    remove_column :classifications, :key
    remove_column :classifications, :system
    remove_column :classifications, :description
    remove_column :classifications, :user_id

    # Make vehicle_id required
    change_column_null :classifications, :vehicle_id, false
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
