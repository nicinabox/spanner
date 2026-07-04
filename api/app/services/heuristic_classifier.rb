# frozen_string_literal: true

class HeuristicClassifier < NoteClassifier
  PRESET_KEYWORDS = YAML.safe_load_file(
    Rails.root.join('config/presets.yml'),
    permitted_classes: [Symbol]
  ).deep_symbolize_keys

  def self.classify(text, **)
    new.classify(text, **)
  end

  def classify(text, vehicle: nil)
    normalized = text.to_s.downcase
    return [] if normalized.blank?

    stemmed = normalized.split.map(&:stem).join(' ')

    vehicle_classifications = vehicle_classifications_for(vehicle)
    overridden_names = vehicle_classifications.map(&:name).map(&:downcase)

    match_preset_keywords(stemmed, overridden_names) +
      match_vehicle_classifications(normalized, stemmed, vehicle_classifications)
  end

  private

  def vehicle_classifications_for(vehicle)
    return Classification.none unless vehicle

    vehicle.classifications.where.not(keywords: [])
  end

  def match_preset_keywords(stemmed, overridden_names)
    results = []

    PRESET_KEYWORDS.each_value do |presets|
      presets.each do |preset|
        name = preset[:name]
        next if overridden_names.include?(name.downcase)

        classification = Classification.find_or_create_by!(name:) do |c|
          c.system = true
          c.key = name.downcase.gsub(/[^a-z0-9]+/, '_').gsub(/_+/, '_').gsub(/_$/, '')
        end

        keywords = classification.keywords.presence || preset[:keywords]
        next unless classify_keywords(stemmed, keywords)

        results << classification_result(classification) unless results.any? { |r| r[:classification].id == classification.id }
      end
    end

    results
  end

  def match_vehicle_classifications(normalized, stemmed, vehicle_classifications)
    vehicle_classifications.each_with_object([]) do |classification, results|
      next if classification.keywords.blank?
      next unless classify_keywords(stemmed, classification.keywords)

      results << classification_result(classification)
    end
  end

  def classification_result(classification)
    { classification: classification, classifier: 'heuristic', confidence: 1.0 }
  end

  def classify_keywords(stemmed, tokens)
    tokens.any? { |token| phrase_match?(stemmed, token) }
  end

  def phrase_match?(stemmed, token)
    words = token.split
    return false if words.empty?

    stemmed_words = words.map(&:stem)

    return stemmed.match?(/\b#{Regexp.escape(stemmed_words.first)}\b/i) if words.one?

    stemmed_words.all? { |w| stemmed.match?(/\b#{Regexp.escape(w)}\b/i) }
  end
end
