class SessionSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :email, :auth_token, :ip, :last_seen, :description
end
