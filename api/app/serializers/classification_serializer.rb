# frozen_string_literal: true

class ClassificationSerializer < ActiveModel::Serializer
  attributes :id, :name, :vehicle_id, :keywords, :created_at, :updated_at
end
