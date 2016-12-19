module ErrorSerializer
  def self.serialize(object)
    return if object.nil?

    if object.is_a? String
      serizlize_message(object)
    else
      serialize_object(object)
    end
  end

  protected

  def serialize_object(object)
    json = {}
    new_hash = object.to_hash(true).map do |k, v|
      v.map do |msg|
        { id: k, title: msg }
      end
    end.flatten
    json[:errors] = new_hash
    json
  end

  def serizlize_message(message)
    message
  end
end
