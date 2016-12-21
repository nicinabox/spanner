# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20161220235806) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "records", force: :cascade do |t|
    t.integer  "vehicle_id"
    t.datetime "date"
    t.integer  "cost"
    t.integer  "mileage"
    t.text     "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "mongo_id"
    t.index ["vehicle_id"], name: "index_records_on_vehicle_id", using: :btree
  end

  create_table "reminders", force: :cascade do |t|
    t.integer  "vehicle_id"
    t.string   "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "mongo_id"
    t.index ["vehicle_id"], name: "index_reminders_on_vehicle_id", using: :btree
  end

  create_table "sessions", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "ip"
    t.string   "description"
    t.string   "auth_token"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["user_id"], name: "index_sessions_on_user_id", using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.string   "login_token"
    t.datetime "login_token_valid_until"
    t.string   "mongo_id"
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
  end

  create_table "vehicles", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "name"
    t.string   "vin"
    t.text     "notes"
    t.integer  "position"
    t.boolean  "enable_cost"
    t.boolean  "retired"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "mongo_id"
    t.index ["user_id"], name: "index_vehicles_on_user_id", using: :btree
  end

end
