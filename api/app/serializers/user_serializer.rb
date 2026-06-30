# frozen_string_literal: true

class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :unconfirmed_email, :time_zone_offset, :created_at, :updated_at, :admin?, :preferences,
             :password_enabled

  attribute :password_enabled do
    object.password_enabled?
  end
end
