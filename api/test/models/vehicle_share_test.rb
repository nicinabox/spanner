# frozen_string_literal: true

require 'test_helper'

class VehicleShareTest < ActiveSupport::TestCase
  setup do
    @owner = users(:one)
    @shared_user = users(:two)
    @vehicle = vehicles(:one)
  end

  test 'creates a valid share' do
    share = VehicleShare.new(vehicle: @vehicle, user: @shared_user, invited_by: @owner)
    assert share.valid?
  end

  test 'prevents duplicate shares' do
    VehicleShare.create!(vehicle: @vehicle, user: @shared_user, invited_by: @owner)
    duplicate = VehicleShare.new(vehicle: @vehicle, user: @shared_user, invited_by: @owner)
    assert_not duplicate.valid?
    assert_includes duplicate.errors[:vehicle_id], 'already shared with this user'
  end

  test 'accept sets accepted_at' do
    share = VehicleShare.create!(vehicle: @vehicle, user: @shared_user, invited_by: @owner)
    assert_nil share.accepted_at
    share.accept!
    assert_not_nil share.accepted_at
  end

  test 'pending scope returns unaccepted shares' do
    accepted = VehicleShare.create!(vehicle: @vehicle, user: @shared_user, invited_by: @owner)
    accepted.accept!
    pending = VehicleShare.create!(vehicle: vehicles(:two), user: @shared_user, invited_by: @owner)

    assert_includes VehicleShare.pending, pending
    assert_not_includes VehicleShare.pending, accepted
  end

  test 'accepted scope returns accepted shares' do
    accepted = VehicleShare.create!(vehicle: @vehicle, user: @shared_user, invited_by: @owner)
    accepted.accept!
    pending = VehicleShare.create!(vehicle: vehicles(:two), user: @shared_user, invited_by: @owner)

    assert_includes VehicleShare.accepted, accepted
    assert_not_includes VehicleShare.accepted, pending
  end
end
