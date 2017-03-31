class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :demo_account?, :can_access_analytics?
end
