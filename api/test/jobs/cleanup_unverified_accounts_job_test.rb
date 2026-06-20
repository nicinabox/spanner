# frozen_string_literal: true

require 'test_helper'

class CleanupUnverifiedAccountsJobTest < ActiveSupport::TestCase
  setup do
    @user = users(:one)
    @admin = users(:admin)
  end

  test 'deletes never-logged-in accounts older than 30 days with no vehicles' do
    unverified = User.create!(
      email: 'unverified@test',
      created_at: 31.days.ago
    )

    assert_difference -> { User.count }, -1 do
      CleanupUnverifiedAccountsJob.new.perform
    end

    assert_not User.exists?(unverified.id)
    assert User.exists?(@user.id)
  end

  test 'does not delete never-logged-in accounts newer than 30 days' do
    new_user = User.create!(
      email: 'newuser@test',
      created_at: 10.days.ago
    )

    CleanupUnverifiedAccountsJob.new.perform

    assert User.exists?(new_user.id)
  end

  test 'does not delete accounts with vehicles even if never logged in' do
    user_with_vehicle = User.create!(
      email: 'hasvehicle@test',
      created_at: 60.days.ago
    )
    user_with_vehicle.vehicles.create!(name: 'My Car')

    CleanupUnverifiedAccountsJob.new.perform

    assert User.exists?(user_with_vehicle.id)
  end

  test 'does not delete admin accounts' do
    admin = User.create!(
      email: 'admin2@test',
      created_at: 60.days.ago,
      admin: true
    )

    CleanupUnverifiedAccountsJob.new.perform

    assert User.exists?(admin.id)
  end

  test 'deletes bounced accounts with no vehicles and no sessions' do
    bounced = User.create!(
      email: 'bounced@test',
      created_at: 5.days.ago,
      email_bounced_at: Time.zone.now
    )

    assert_difference -> { User.count }, -1 do
      CleanupUnverifiedAccountsJob.new.perform
    end

    assert_not User.exists?(bounced.id)
  end

  test 'deletes inactive accounts with no vehicles last seen over 1 year ago' do
    inactive = User.create!(
      email: 'inactive@test',
      created_at: 2.years.ago
    )
    inactive.sessions.create!(
      ip: '1.1.1.1',
      auth_token: 'tok123',
      auth_token_valid_until: 2.years.from_now,
      last_seen: 2.years.ago
    )

    assert_difference -> { User.count }, -1 do
      CleanupUnverifiedAccountsJob.new.perform
    end

    assert_not User.exists?(inactive.id)
  end

  test 'does not delete inactive accounts with vehicles' do
    inactive_with_vehicle = User.create!(
      email: 'inactivevehicle@test',
      created_at: 2.years.ago
    )
    inactive_with_vehicle.sessions.create!(
      ip: '1.1.1.1',
      auth_token: 'tok456',
      auth_token_valid_until: 2.years.from_now,
      last_seen: 2.years.ago
    )
    inactive_with_vehicle.vehicles.create!(name: 'Old Car')

    CleanupUnverifiedAccountsJob.new.perform

    assert User.exists?(inactive_with_vehicle.id)
  end

  test 'deletes associated sessions when cleaning up' do
    unverified = User.create!(
      email: 'withsession@test',
      created_at: 2.years.ago
    )
    unverified.sessions.create!(
      ip: '1.1.1.1',
      auth_token: 'tok789',
      auth_token_valid_until: 2.years.from_now,
      last_seen: 2.years.ago
    )
    session_id = unverified.sessions.first.id

    CleanupUnverifiedAccountsJob.new.perform

    assert_not User.exists?(unverified.id)
    assert_not Session.exists?(session_id)
  end
end
