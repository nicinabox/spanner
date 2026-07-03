# frozen_string_literal: true

class NullifyLastCompletedRecordOnRecordDelete < ActiveRecord::Migration[8.0]
  def up
    remove_foreign_key :service_schedules, :records, name: 'fk_rails_286a469962'
    add_foreign_key :service_schedules, :records,
                    column: :last_completed_record_id,
                    name: 'fk_rails_286a469962',
                    on_delete: :nullify
  end

  def down
    remove_foreign_key :service_schedules, :records, name: 'fk_rails_286a469962'
    add_foreign_key :service_schedules, :records,
                    column: :last_completed_record_id,
                    name: 'fk_rails_286a469962'
  end
end
