# frozen_string_literal: true

class ClassificationSerializer < ActiveModel::Serializer
  attributes :id, :key, :name, :description, :system,
             :default_mileage_interval, :default_month_interval,
             :created_at, :updated_at
end
