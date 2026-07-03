# frozen_string_literal: true

class AddAutoTaggedToRecordClassifications < ActiveRecord::Migration[8.0]
  def change
    add_column :record_classifications, :auto_tagged, :boolean, null: false, default: true
  end
end