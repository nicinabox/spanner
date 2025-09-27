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

ActiveRecord::Schema[8.0].define(version: 2023_01_09_013025) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "hstore"
  enable_extension "pg_catalog.plpgsql"

  create_table "queue_classic_jobs", force: :cascade do |t|
    t.text "q_name", null: false
    t.text "method", null: false
    t.json "args", null: false
    t.datetime "locked_at"
    t.integer "locked_by"
    t.datetime "created_at", default: -> { "now()" }
    t.datetime "scheduled_at", default: -> { "now()" }
    t.index ["q_name", "id"], name: "idx_qc_on_name_only_unlocked", where: "(locked_at IS NULL)"
    t.index ["scheduled_at", "id"], name: "idx_qc_on_scheduled_at_only_unlocked", where: "(locked_at IS NULL)"
  end

  create_table "records", force: :cascade do |t|
    t.integer "vehicle_id"
    t.datetime "date"
    t.string "cost"
    t.float "mileage"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "mongo_id"
    t.string "record_type"
    t.index ["vehicle_id"], name: "index_records_on_vehicle_id"
  end

  create_table "reminders", force: :cascade do |t|
    t.integer "vehicle_id"
    t.string "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "mongo_id"
    t.datetime "date"
    t.integer "mileage"
    t.string "reminder_type"
    t.date "reminder_date"
    t.index ["vehicle_id"], name: "index_reminders_on_vehicle_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.integer "user_id"
    t.string "ip"
    t.string "description"
    t.string "auth_token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "last_seen"
    t.datetime "auth_token_valid_until"
    t.string "user_agent"
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "login_token"
    t.datetime "login_token_valid_until"
    t.string "mongo_id"
    t.string "time_zone_offset"
    t.json "preferences"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "vehicles", force: :cascade do |t|
    t.integer "user_id"
    t.string "name"
    t.string "vin"
    t.text "notes"
    t.integer "position"
    t.boolean "enable_cost"
    t.boolean "retired"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "mongo_id"
    t.string "distance_unit", default: "mi"
    t.boolean "prompt_for_records", default: true
    t.string "color"
    t.hstore "preferences"
    t.index ["preferences"], name: "index_vehicles_on_preferences", using: :gin
    t.index ["user_id"], name: "index_vehicles_on_user_id"
  end
end
