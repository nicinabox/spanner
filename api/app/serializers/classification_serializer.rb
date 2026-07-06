# frozen_string_literal: true

class ClassificationSerializer < ActiveModel::Serializer
  attributes :id, :key, :name, :description, :system, :keywords,
             :created_at, :updated_at
end
