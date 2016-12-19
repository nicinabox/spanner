class SessionSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :email, :auth_token
end
