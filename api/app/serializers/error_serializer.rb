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
    object.errors.messages.map do |field, errors|
      errors.map do |error_message|
        {
          source: {
            pointer: "/data/attributes/#{field}"
          },
          detail: error_message
        }
      end
    end.flatten
  end

  def serizlize_message(message)
    message
  end
end
