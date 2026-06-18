# frozen_string_literal: true

class CreateRecordClassifications < ActiveRecord::Migration[8.0]
  def change
    create_table :record_classifications do |t|
      t.references :record, null: false, foreign_key: true
      t.references :classification, null: false, foreign_key: true
      t.string :classifier, null: false
      t.float :confidence, null: false, default: 1.0

      t.timestamps
    end

    add_index :record_classifications, %i[record_id classification_id], unique: true
  end
end
