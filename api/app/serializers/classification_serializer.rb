# frozen_string_literal: true

class ClassificationSerializer < ActiveModel::Serializer
  attributes :id, :key, :name, :description, :system,
             :created_at, :updated_at
end
