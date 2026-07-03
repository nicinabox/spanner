# frozen_string_literal: true

require 'test_helper'

class ShareLinkTest < ActiveSupport::TestCase
  setup do
    @vehicle = vehicles(:one)
  end

  test 'creates a valid share link' do
    link = ShareLink.new(vehicle: @vehicle)
    assert link.valid?
  end

  test 'generates token on create' do
    link = ShareLink.create!(vehicle: @vehicle)
    assert_not_nil link.token
    assert_equal 32, link.token.length # urlsafe_base64(24) = 32 chars
  end

  test 'enforces unique token' do
    link1 = ShareLink.create!(vehicle: @vehicle)
    link2 = ShareLink.new(vehicle: @vehicle, token: link1.token)
    assert_not link2.valid?
    assert_includes link2.errors[:token], 'has already been taken'
  end

  test 'to_param returns token' do
    link = ShareLink.create!(vehicle: @vehicle)
    assert_equal link.token, link.to_param
  end
end
