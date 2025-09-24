# frozen_string_literal: true

class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :time_zone_offset, :created_at, :updated_at, :demo_account?, :can_access_analytics?,
             :preferences
end
