# frozen_string_literal: true

class ClassificationSerializer < ActiveModel::Serializer
  attributes :id, :key, :name, :description, :system, :vehicle_id, :keywords,
             :created_at, :updated_at

  def keywords
    kw = object.keywords
    return kw if kw.present?

    all = ServiceSchedule::PRESETS.each_value.flat_map do |group|
      group[:items].select { |item| item[:name].casecmp?(object.name) }.flat_map { |item| item[:keywords] }
    end
    all.uniq.presence || kw
  end
end
