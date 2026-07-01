# frozen_string_literal: true

require "test_helper"
require "rake"

class SetupTaskTest < ActiveSupport::TestCase
  def setup
    Rake.application = Rake::Application.new
    Rake.application.rake_require("tasks/setup", [Rails.root.join("lib").to_s])
    Rake::Task.define_task(:environment)
  end

  test "exits early if admin already exists" do
    User.create!(email: "admin@example.com", password: "password123", admin: true)
    assert User.exists?(admin: true)
  end

  test "creates admin user" do
    assert_difference("User.count", 1) do
      User.create!(email: "newadmin@example.com", password: "password123", admin: true)
    end
    user = User.find_by(email: "newadmin@example.com")
    assert user.admin
    assert user.password_enabled?
  end

  test "generates valid secrets" do
    assert_match /\A[0-9a-f]{64}\z/, SecureRandom.hex(32)
    assert_match /\A[0-9a-f]{128}\z/, SecureRandom.hex(64)
    assert_match /\A[A-Za-z0-9_-]{43}\z/, SecureRandom.urlsafe_base64(32)
  end
end
