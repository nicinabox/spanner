# frozen_string_literal: true

class BackfillRecordClassifications < ActiveRecord::Migration[8.0]
  # Backfilling existing records is performed via `rake classifications:backfill`
  # rather than inside the migration, to avoid long-running data transforms
  # and dependency on application code during schema changes.
  def up; end

  def down; end
end
