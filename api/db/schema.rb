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

ActiveRecord::Schema[8.1].define(version: 2026_08_09_053033) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "hstore"
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "classifications", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "keywords", default: [], array: true
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.bigint "vehicle_id", null: false
    t.index ["vehicle_id", "name"], name: "index_classifications_on_vehicle_id_and_name", unique: true, where: "(vehicle_id IS NOT NULL)"
    t.index ["vehicle_id"], name: "index_classifications_on_vehicle_id"
  end

  create_table "queue_classic_jobs", force: :cascade do |t|
    t.json "args", null: false
    t.timestamptz "created_at", default: -> { "now()" }
    t.timestamptz "locked_at"
    t.integer "locked_by"
    t.text "method", null: false
    t.text "q_name", null: false
    t.timestamptz "scheduled_at", default: -> { "now()" }
    t.index ["q_name", "id"], name: "idx_qc_on_name_only_unlocked", where: "(locked_at IS NULL)"
    t.index ["scheduled_at", "id"], name: "idx_qc_on_scheduled_at_only_unlocked", where: "(locked_at IS NULL)"
    t.check_constraint "length(method) > 0", name: "queue_classic_jobs_method_check"
    t.check_constraint "length(q_name) > 0", name: "queue_classic_jobs_q_name_check"
  end

  create_table "record_classifications", force: :cascade do |t|
    t.boolean "auto_tagged", default: true, null: false
    t.bigint "classification_id", null: false
    t.string "classifier", null: false
    t.float "confidence", default: 1.0, null: false
    t.datetime "created_at", null: false
    t.bigint "record_id", null: false
    t.datetime "updated_at", null: false
    t.index ["classification_id"], name: "index_record_classifications_on_classification_id"
    t.index ["record_id", "classification_id"], name: "idx_on_record_id_classification_id_cae9a35d49", unique: true
    t.index ["record_id"], name: "index_record_classifications_on_record_id"
  end

  create_table "records", id: :serial, force: :cascade do |t|
    t.string "cost"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "date", precision: nil
    t.float "mileage"
    t.text "notes"
    t.string "record_type"
    t.datetime "updated_at", precision: nil, null: false
    t.integer "vehicle_id"
    t.index ["vehicle_id"], name: "index_records_on_vehicle_id"
  end

  create_table "reminders", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.datetime "date", precision: nil
    t.integer "mileage"
    t.string "notes"
    t.date "reminder_date"
    t.string "reminder_type"
    t.bigint "service_schedule_id"
    t.datetime "updated_at", precision: nil, null: false
    t.integer "vehicle_id"
    t.index ["service_schedule_id"], name: "index_reminders_on_service_schedule_id"
    t.index ["vehicle_id"], name: "index_reminders_on_vehicle_id"
  end

  create_table "service_schedules", force: :cascade do |t|
    t.bigint "classification_id", null: false
    t.datetime "created_at", null: false
    t.integer "defer_delta_miles"
    t.integer "defer_delta_months"
    t.integer "distance_interval"
    t.boolean "enabled", default: true, null: false
    t.bigint "last_completed_record_id"
    t.integer "month_interval"
    t.date "next_due_date"
    t.integer "next_due_mileage"
    t.text "notes"
    t.datetime "updated_at", null: false
    t.bigint "vehicle_id", null: false
    t.index ["classification_id"], name: "index_service_schedules_on_classification_id"
    t.index ["last_completed_record_id"], name: "index_service_schedules_on_last_completed_record_id"
    t.index ["vehicle_id", "classification_id"], name: "index_service_schedules_on_vehicle_id_and_classification_id", unique: true
    t.index ["vehicle_id"], name: "index_service_schedules_on_vehicle_id"
  end

  create_table "sessions", id: :serial, force: :cascade do |t|
    t.string "auth_token"
    t.datetime "auth_token_valid_until", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.string "description"
    t.string "ip"
    t.datetime "last_seen", precision: nil
    t.datetime "updated_at", precision: nil, null: false
    t.string "user_agent"
    t.integer "user_id"
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "share_links", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "token", null: false
    t.datetime "updated_at", null: false
    t.bigint "vehicle_id", null: false
    t.index ["token"], name: "index_share_links_on_token", unique: true
    t.index ["vehicle_id"], name: "index_share_links_on_vehicle_id"
  end

  create_table "solid_queue_blocked_executions", force: :cascade do |t|
    t.string "concurrency_key", null: false
    t.datetime "created_at", null: false
    t.datetime "expires_at", null: false
    t.bigint "job_id", null: false
    t.integer "priority", default: 0, null: false
    t.string "queue_name", null: false
    t.index ["concurrency_key", "priority", "job_id"], name: "index_solid_queue_blocked_executions_for_release"
    t.index ["expires_at", "concurrency_key"], name: "index_solid_queue_blocked_executions_for_maintenance"
    t.index ["job_id"], name: "index_solid_queue_blocked_executions_on_job_id", unique: true
  end

  create_table "solid_queue_claimed_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "job_id", null: false
    t.bigint "process_id"
    t.index ["job_id"], name: "index_solid_queue_claimed_executions_on_job_id", unique: true
    t.index ["process_id", "job_id"], name: "index_solid_queue_claimed_executions_on_process_id_and_job_id"
  end

  create_table "solid_queue_failed_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "error"
    t.bigint "job_id", null: false
    t.index ["job_id"], name: "index_solid_queue_failed_executions_on_job_id", unique: true
  end

  create_table "solid_queue_jobs", force: :cascade do |t|
    t.string "active_job_id"
    t.text "arguments"
    t.string "class_name", null: false
    t.string "concurrency_key"
    t.datetime "created_at", null: false
    t.datetime "finished_at"
    t.integer "priority", default: 0, null: false
    t.string "queue_name", null: false
    t.datetime "scheduled_at"
    t.datetime "updated_at", null: false
    t.index ["active_job_id"], name: "index_solid_queue_jobs_on_active_job_id"
    t.index ["class_name"], name: "index_solid_queue_jobs_on_class_name"
    t.index ["finished_at"], name: "index_solid_queue_jobs_on_finished_at"
    t.index ["queue_name", "finished_at"], name: "index_solid_queue_jobs_for_filtering"
    t.index ["scheduled_at", "finished_at"], name: "index_solid_queue_jobs_for_alerting"
  end

  create_table "solid_queue_pauses", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "queue_name", null: false
    t.index ["queue_name"], name: "index_solid_queue_pauses_on_queue_name", unique: true
  end

  create_table "solid_queue_processes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "hostname"
    t.string "kind", null: false
    t.datetime "last_heartbeat_at", null: false
    t.text "metadata"
    t.string "name", null: false
    t.integer "pid", null: false
    t.bigint "supervisor_id"
    t.index ["last_heartbeat_at"], name: "index_solid_queue_processes_on_last_heartbeat_at"
    t.index ["name", "supervisor_id"], name: "index_solid_queue_processes_on_name_and_supervisor_id", unique: true
    t.index ["supervisor_id"], name: "index_solid_queue_processes_on_supervisor_id"
  end

  create_table "solid_queue_ready_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "job_id", null: false
    t.integer "priority", default: 0, null: false
    t.string "queue_name", null: false
    t.index ["job_id"], name: "index_solid_queue_ready_executions_on_job_id", unique: true
    t.index ["priority", "job_id"], name: "index_solid_queue_poll_all"
    t.index ["queue_name", "priority", "job_id"], name: "index_solid_queue_poll_by_queue"
  end

  create_table "solid_queue_recurring_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "job_id", null: false
    t.datetime "run_at", null: false
    t.string "task_key", null: false
    t.index ["job_id"], name: "index_solid_queue_recurring_executions_on_job_id", unique: true
    t.index ["task_key", "run_at"], name: "index_solid_queue_recurring_executions_on_task_key_and_run_at", unique: true
  end

  create_table "solid_queue_recurring_tasks", force: :cascade do |t|
    t.text "arguments"
    t.string "class_name"
    t.string "command", limit: 2048
    t.datetime "created_at", null: false
    t.text "description"
    t.string "key", null: false
    t.integer "priority", default: 0
    t.string "queue_name"
    t.string "schedule", null: false
    t.boolean "static", default: true, null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_solid_queue_recurring_tasks_on_key", unique: true
    t.index ["static"], name: "index_solid_queue_recurring_tasks_on_static"
  end

  create_table "solid_queue_scheduled_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "job_id", null: false
    t.integer "priority", default: 0, null: false
    t.string "queue_name", null: false
    t.datetime "scheduled_at", null: false
    t.index ["job_id"], name: "index_solid_queue_scheduled_executions_on_job_id", unique: true
    t.index ["scheduled_at", "priority", "job_id"], name: "index_solid_queue_dispatch_all"
  end

  create_table "solid_queue_semaphores", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "expires_at", null: false
    t.string "key", null: false
    t.datetime "updated_at", null: false
    t.integer "value", default: 1, null: false
    t.index ["expires_at"], name: "index_solid_queue_semaphores_on_expires_at"
    t.index ["key", "value"], name: "index_solid_queue_semaphores_on_key_and_value"
    t.index ["key"], name: "index_solid_queue_semaphores_on_key", unique: true
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "account_token"
    t.boolean "admin", default: false, null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "deleted_at"
    t.string "email"
    t.datetime "email_bounced_at"
    t.string "email_confirmation_token"
    t.datetime "email_confirmation_token_valid_until"
    t.datetime "last_reminder_sent_at"
    t.string "login_token"
    t.datetime "login_token_valid_until", precision: nil
    t.string "password_digest"
    t.string "password_reset_token"
    t.datetime "password_reset_token_valid_until"
    t.json "preferences"
    t.string "time_zone_offset"
    t.string "unconfirmed_email"
    t.datetime "unsubscribed_at"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["email_confirmation_token"], name: "index_users_on_email_confirmation_token"
  end

  create_table "vehicle_shares", force: :cascade do |t|
    t.datetime "accepted_at"
    t.datetime "created_at", null: false
    t.bigint "invited_by_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.bigint "vehicle_id", null: false
    t.index ["invited_by_id"], name: "index_vehicle_shares_on_invited_by_id"
    t.index ["user_id"], name: "index_vehicle_shares_on_user_id"
    t.index ["vehicle_id", "user_id"], name: "index_vehicle_shares_on_vehicle_id_and_user_id", unique: true
    t.index ["vehicle_id"], name: "index_vehicle_shares_on_vehicle_id"
  end

  create_table "vehicles", id: :serial, force: :cascade do |t|
    t.string "color"
    t.datetime "created_at", precision: nil, null: false
    t.string "distance_unit", default: "mi"
    t.boolean "enable_cost"
    t.string "name"
    t.text "notes"
    t.integer "position"
    t.hstore "preferences"
    t.boolean "prompt_for_records", default: true
    t.boolean "retired"
    t.datetime "updated_at", precision: nil, null: false
    t.integer "user_id"
    t.string "vin"
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
  add_foreign_key "solid_queue_blocked_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_claimed_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_failed_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_ready_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_recurring_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_scheduled_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "vehicle_shares", "users"
  add_foreign_key "vehicle_shares", "users", column: "invited_by_id"
  add_foreign_key "vehicle_shares", "vehicles"
end
