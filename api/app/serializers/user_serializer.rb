class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :demo_account?
end
