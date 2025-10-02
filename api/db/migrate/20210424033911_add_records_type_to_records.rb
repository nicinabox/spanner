class AddRecordsTypeToRecords < ActiveRecord::Migration[5.0]
  def change
    add_column :records, :record_type, :string
  end
end
