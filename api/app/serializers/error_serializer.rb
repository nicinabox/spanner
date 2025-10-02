# frozen_string_literal: true

module ErrorSerializer
  def self.serialize(object)
    if object.is_a? String
      serizlize_message(object)
    else
      serialize_object(object)
    end
  end

  protected

  def serialize_object(object)
    return if object.errors.nil?

    object.errors.to_hash(true).map do |k, v|
      v.map do |msg|
        { id: k, title: msg }
      end
    end.flatten
  end

  def serizlize_message(message)
    message
  end
end
