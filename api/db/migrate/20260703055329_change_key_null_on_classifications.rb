class ChangeKeyNullOnClassifications < ActiveRecord::Migration[8.0]
  def change
    change_column_null :classifications, :key, true
  end
end
