# frozen_string_literal: true

class SessionSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :email, :auth_token, :ip, :last_seen, :description, :user_agent
end
