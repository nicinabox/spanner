# frozen_string_literal: true

class ClassificationSerializer < ActiveModel::Serializer
  attributes :id, :key, :name, :description, :system, :keywords,
             :created_at, :updated_at

  def keywords
    kw = object.keywords
    return kw if kw.present?

    ServiceSchedule::PRESETS.each_value do |items|
      items.each do |item|
        return item[:keywords] if item[:name].casecmp?(object.name)
      end
    end

    kw
  end
end
