# frozen_string_literal: true

# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 20_260_619_153_248) do
  # These are extensions that must be enabled in order to support this database
  enable_extension 'hstore'
  enable_extension 'pg_catalog.plpgsql'

  create_table 'classifications', force: :cascade do |t|
    t.string 'key', null: false
    t.string 'name', null: false
    t.text 'description'
    t.boolean 'system', default: true, null: false
    t.integer 'default_mileage_interval'
    t.integer 'default_month_interval'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['key'], name: 'index_classifications_on_key', unique: true
  end

  create_table 'queue_classic_jobs', force: :cascade do |t|
    t.text 'q_name', null: false
    t.text 'method', null: false
    t.json 'args', null: false
    t.timestamptz 'locked_at'
    t.integer 'locked_by'
    t.timestamptz 'created_at', default: -> { 'now()' }
    t.timestamptz 'scheduled_at', default: -> { 'now()' }
    t.index %w[q_name id], name: 'idx_qc_on_name_only_unlocked', where: '(locked_at IS NULL)'
    t.index %w[scheduled_at id], name: 'idx_qc_on_scheduled_at_only_unlocked', where: '(locked_at IS NULL)'
    t.check_constraint 'length(method) > 0', name: 'queue_classic_jobs_method_check'
    t.check_constraint 'length(q_name) > 0', name: 'queue_classic_jobs_q_name_check'
  end

  create_table 'record_classifications', force: :cascade do |t|
    t.bigint 'record_id', null: false
    t.bigint 'classification_id', null: false
    t.string 'classifier', null: false
    t.float 'confidence', default: 1.0, null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['classification_id'], name: 'index_record_classifications_on_classification_id'
    t.index %w[record_id classification_id], name: 'idx_on_record_id_classification_id_cae9a35d49', unique: true
    t.index ['record_id'], name: 'index_record_classifications_on_record_id'
  end

  create_table 'records', id: :serial, force: :cascade do |t|
    t.integer 'vehicle_id'
    t.datetime 'date', precision: nil
    t.string 'cost'
    t.float 'mileage'
    t.text 'notes'
    t.datetime 'created_at', precision: nil, null: false
    t.datetime 'updated_at', precision: nil, null: false
    t.string 'record_type'
    t.index ['vehicle_id'], name: 'index_records_on_vehicle_id'
  end

  create_table 'reminders', id: :serial, force: :cascade do |t|
    t.integer 'vehicle_id'
    t.string 'notes'
    t.datetime 'created_at', precision: nil, null: false
    t.datetime 'updated_at', precision: nil, null: false
    t.datetime 'date', precision: nil
    t.integer 'mileage'
    t.string 'reminder_type'
    t.date 'reminder_date'
    t.index ['vehicle_id'], name: 'index_reminders_on_vehicle_id'
  end

  create_table 'sessions', id: :serial, force: :cascade do |t|
    t.integer 'user_id'
    t.string 'ip'
    t.string 'description'
    t.string 'auth_token'
    t.datetime 'created_at', precision: nil, null: false
    t.datetime 'updated_at', precision: nil, null: false
    t.datetime 'last_seen', precision: nil
    t.datetime 'auth_token_valid_until', precision: nil
    t.string 'user_agent'
    t.index ['user_id'], name: 'index_sessions_on_user_id'
  end

  create_table 'users', id: :serial, force: :cascade do |t|
    t.string 'email'
    t.datetime 'created_at', precision: nil, null: false
    t.datetime 'updated_at', precision: nil, null: false
    t.string 'login_token'
    t.datetime 'login_token_valid_until', precision: nil
    t.string 'time_zone_offset'
    t.json 'preferences'
    t.datetime 'last_reminder_sent_at'
    t.index ['email'], name: 'index_users_on_email', unique: true
  end

  create_table 'vehicles', id: :serial, force: :cascade do |t|
    t.integer 'user_id'
    t.string 'name'
    t.string 'vin'
    t.text 'notes'
    t.integer 'position'
    t.boolean 'enable_cost'
    t.boolean 'retired'
    t.datetime 'created_at', precision: nil, null: false
    t.datetime 'updated_at', precision: nil, null: false
    t.string 'distance_unit', default: 'mi'
    t.boolean 'prompt_for_records', default: true
    t.string 'color'
    t.hstore 'preferences'
    t.string 'notification_token'
    t.datetime 'snoozed_until'
    t.datetime 'prompt_snoozed_until'
    t.index ['notification_token'], name: 'index_vehicles_on_notification_token', unique: true
    t.index ['preferences'], name: 'index_vehicles_on_preferences', using: :gin
    t.index ['user_id'], name: 'index_vehicles_on_user_id'
  end

  add_foreign_key 'record_classifications', 'classifications'
  add_foreign_key 'record_classifications', 'records'
end
