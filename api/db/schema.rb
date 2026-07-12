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

ActiveRecord::Schema[8.0].define(version: 2026_07_11_202318) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "hstore"
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "classifications", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "vehicle_id", null: false
    t.text "keywords", default: [], array: true
    t.index ["vehicle_id", "name"], name: "index_classifications_on_vehicle_id_and_name", unique: true, where: "(vehicle_id IS NOT NULL)"
    t.index ["vehicle_id"], name: "index_classifications_on_vehicle_id"
  end

  create_table "queue_classic_jobs", force: :cascade do |t|
    t.text "q_name", null: false
    t.text "method", null: false
    t.json "args", null: false
    t.timestamptz "locked_at"
    t.integer "locked_by"
    t.timestamptz "created_at", default: -> { "now()" }
    t.timestamptz "scheduled_at", default: -> { "now()" }
    t.index ["q_name", "id"], name: "idx_qc_on_name_only_unlocked", where: "(locked_at IS NULL)"
    t.index ["scheduled_at", "id"], name: "idx_qc_on_scheduled_at_only_unlocked", where: "(locked_at IS NULL)"
    t.check_constraint "length(method) > 0", name: "queue_classic_jobs_method_check"
    t.check_constraint "length(q_name) > 0", name: "queue_classic_jobs_q_name_check"
  end

  create_table "record_classifications", force: :cascade do |t|
    t.bigint "record_id", null: false
    t.bigint "classification_id", null: false
    t.string "classifier", null: false
    t.float "confidence", default: 1.0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "auto_tagged", default: true, null: false
    t.index ["classification_id"], name: "index_record_classifications_on_classification_id"
    t.index ["record_id", "classification_id"], name: "idx_on_record_id_classification_id_cae9a35d49", unique: true
    t.index ["record_id"], name: "index_record_classifications_on_record_id"
  end

  create_table "records", id: :serial, force: :cascade do |t|
    t.integer "vehicle_id"
    t.datetime "date", precision: nil
    t.string "cost"
    t.float "mileage"
    t.text "notes"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "record_type"
    t.index ["vehicle_id"], name: "index_records_on_vehicle_id"
  end

  create_table "reminders", id: :serial, force: :cascade do |t|
    t.integer "vehicle_id"
    t.string "notes"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.datetime "date", precision: nil
    t.integer "mileage"
    t.string "reminder_type"
    t.date "reminder_date"
    t.bigint "service_schedule_id"
    t.index ["service_schedule_id"], name: "index_reminders_on_service_schedule_id"
    t.index ["vehicle_id"], name: "index_reminders_on_vehicle_id"
  end

  create_table "service_schedules", force: :cascade do |t|
    t.bigint "vehicle_id", null: false
    t.bigint "classification_id", null: false
    t.integer "distance_interval"
    t.integer "month_interval"
    t.text "notes"
    t.boolean "enabled", default: true, null: false
    t.bigint "last_completed_record_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "next_due_date"
    t.integer "next_due_mileage"
    t.index ["classification_id"], name: "index_service_schedules_on_classification_id"
    t.index ["last_completed_record_id"], name: "index_service_schedules_on_last_completed_record_id"
    t.index ["vehicle_id", "classification_id"], name: "index_service_schedules_on_vehicle_id_and_classification_id", unique: true
    t.index ["vehicle_id"], name: "index_service_schedules_on_vehicle_id"
  end

  create_table "sessions", id: :serial, force: :cascade do |t|
    t.integer "user_id"
    t.string "ip"
    t.string "description"
    t.string "auth_token"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.datetime "last_seen", precision: nil
    t.datetime "auth_token_valid_until", precision: nil
    t.string "user_agent"
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "share_links", force: :cascade do |t|
    t.bigint "vehicle_id", null: false
    t.string "token", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["token"], name: "index_share_links_on_token", unique: true
    t.index ["vehicle_id"], name: "index_share_links_on_vehicle_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "login_token"
    t.datetime "login_token_valid_until", precision: nil
    t.string "time_zone_offset"
    t.json "preferences"
    t.datetime "last_reminder_sent_at"
    t.boolean "admin", default: false, null: false
    t.string "unconfirmed_email"
    t.string "email_confirmation_token"
    t.datetime "email_confirmation_token_valid_until"
    t.datetime "email_bounced_at"
    t.datetime "deleted_at"
    t.datetime "unsubscribed_at"
    t.string "account_token"
    t.string "password_reset_token"
    t.datetime "password_reset_token_valid_until"
    t.string "password_digest"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["email_confirmation_token"], name: "index_users_on_email_confirmation_token"
  end

  create_table "vehicle_shares", force: :cascade do |t|
    t.bigint "vehicle_id", null: false
    t.bigint "user_id", null: false
    t.bigint "invited_by_id", null: false
    t.datetime "accepted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["invited_by_id"], name: "index_vehicle_shares_on_invited_by_id"
    t.index ["user_id"], name: "index_vehicle_shares_on_user_id"
    t.index ["vehicle_id", "user_id"], name: "index_vehicle_shares_on_vehicle_id_and_user_id", unique: true
    t.index ["vehicle_id"], name: "index_vehicle_shares_on_vehicle_id"
  end

  create_table "vehicles", id: :serial, force: :cascade do |t|
    t.integer "user_id"
    t.string "name"
    t.string "vin"
    t.text "notes"
    t.integer "position"
    t.boolean "enable_cost"
    t.boolean "retired"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "distance_unit", default: "mi"
    t.boolean "prompt_for_records", default: true
    t.string "color"
    t.hstore "preferences"
    t.index ["preferences"], name: "index_vehicles_on_preferences", using: :gin
    t.index ["user_id"], name: "index_vehicles_on_user_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "classifications", "vehicles"
  add_foreign_key "record_classifications", "classifications"
  add_foreign_key "record_classifications", "records"
  add_foreign_key "reminders", "service_schedules"
  add_foreign_key "service_schedules", "classifications"
  add_foreign_key "service_schedules", "records", column: "last_completed_record_id", on_delete: :nullify
  add_foreign_key "service_schedules", "vehicles"
  add_foreign_key "share_links", "vehicles"
  add_foreign_key "vehicle_shares", "users"
  add_foreign_key "vehicle_shares", "users", column: "invited_by_id"
  add_foreign_key "vehicle_shares", "vehicles"
end
