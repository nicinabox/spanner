# frozen_string_literal: true

class HeuristicClassifier < NoteClassifier
  def self.classify(text, **)
    new.classify(text, **)
  end

  def classify(text, vehicle: nil)
    normalized = text.to_s.downcase
    return [] if normalized.blank?

    stemmed = normalized.gsub(/[^a-z0-9\s]/, '').split.map(&:stem).join(' ')

    vehicle_classifications = vehicle_classifications_for(vehicle)

    match_vehicle_classifications(normalized, stemmed, vehicle_classifications)
  end

  private

  def vehicle_classifications_for(vehicle)
    return Classification.none unless vehicle

    vehicle.classifications.where.not(keywords: [])
  end

  def match_vehicle_classifications(normalized, stemmed, vehicle_classifications)
    vehicle_classifications.each_with_object([]) do |classification, results|
      next if classification.keywords.blank?
      next unless classify_keywords(stemmed, classification.keywords)

      confidence = calculate_confidence(
        normalized, classification.name,
        keywords: classification.keywords
      )
      results << { classification:, classifier: 'heuristic', confidence: }
    end
  end

  def calculate_confidence(normalized, name, keywords:)
    stemmed = normalized.gsub(/[^a-z0-9\s]/, '').split.map(&:stem).join(' ')
    matched = keywords.count { |kw| phrase_match?(stemmed, kw) }
    ratio = matched.to_f / keywords.size

    confidence = 0.4 + (ratio * 0.3)
    confidence += 0.1 if normalized.match?(/\b#{Regexp.escape(name.downcase)}\b/)
    confidence.clamp(0.0, 1.0).round(2)
  end

  def classify_keywords(stemmed, tokens)
    tokens.any? { |token| phrase_match?(stemmed, token) }
  end

  def phrase_match?(stemmed, token)
    words = token.gsub(/[^a-z0-9\s]/, '').split
    return false if words.empty?

    stemmed_words = words.map(&:stem)

    return stemmed.match?(/\b#{Regexp.escape(stemmed_words.first)}\b/i) if words.one?

    pattern = stemmed_words.map { |w| Regexp.escape(w) }.join('[\\s,;.]+')
    return true if stemmed.match?(/\b#{pattern}\b/i)

    # Check reversed word order (e.g. "change oil" vs "oil change")
    reversed = stemmed_words.reverse
    rev_pattern = reversed.map { |w| Regexp.escape(w) }.join('[\\s,;.]+')
    stemmed.match?(/\b#{rev_pattern}\b/i)
  end
end
