# frozen_string_literal: true

module ErrorSerializer
  def self.serialize(object)
    if object.is_a? String
      serialize_message(object)
    else
      serialize_object(object)
    end
  end

  def self.serialize_object(object)
    return if object.errors.nil?

    object.errors.to_hash(true).map do |k, v|
      v.map do |msg|
        { id: k, title: msg }
      end
    end.flatten
  end

  def self.serialize_message(message)
    message
  end
end
