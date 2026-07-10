# frozen_string_literal: true

class HeuristicClassifier < NoteClassifier
  PRESET_KEYWORDS = Rails.root.glob('config/presets/*.yml').each_with_object({}) do |path, hash|
    type = File.basename(path, '.yml')
    hash[type] = YAML.safe_load_file(path, permitted_classes: [Symbol]).deep_symbolize_keys
  end.freeze

  def self.classify(text, **)
    new.classify(text, **)
  end

  def classify(text, vehicle: nil)
    normalized = text.to_s.downcase
    return [] if normalized.blank?

    stemmed = normalized.gsub(/[^a-z0-9\s]/, '').split.map(&:stem).join(' ')

    vehicle_classifications = vehicle_classifications_for(vehicle)
    overridden_names = vehicle_classifications.map(&:name).map(&:downcase)

    all_context_words = preset_context_words

    results = match_preset_keywords(normalized, stemmed, overridden_names, all_context_words)
    results += match_vehicle_classifications(normalized, stemmed, vehicle_classifications)

    deduplicate_results(results)
  end

  def preset_context_words
    PRESET_KEYWORDS.values
                   .flat_map { |v| v[:items] }
                   .flat_map { |p| p[:context] || [] }
                   .uniq
  end

  def deduplicate_results(results)
    results.group_by { |r| r[:classification].id }.values.map do |group|
      group.max_by { |r| r[:confidence] }
    end
  end

  private

  def vehicle_classifications_for(vehicle)
    return Classification.none unless vehicle

    vehicle.classifications.where.not(keywords: [])
  end

  def match_preset_keywords(normalized, stemmed, overridden_names, all_context_words)
    results = []

    PRESET_KEYWORDS.each_value do |group|
      group[:items].each do |preset|
        next if overridden_names.include?(preset[:name].downcase)

        result = match_single_preset(normalized, stemmed, preset, all_context_words)
        results << result if result
      end
    end

    results
  end

  def match_single_preset(normalized, stemmed, preset, all_context_words)
    name = preset[:name]
    classification = Classification.find_by(name:)
    keywords = classification&.keywords.presence || preset[:keywords]
    return unless classify_keywords(stemmed, keywords)

    context = preset[:context] || []
    conflicting = all_context_words - context
    confidence = calculate_confidence(
      normalized, name,
      context_words: context,
      keywords:,
      conflicting_context: conflicting
    )

    classification ||= Classification.find_or_create_by!(name:) do |c|
      c.system = true
      c.key = name.downcase.gsub(/[^a-z0-9]+/, '_').gsub(/_+/, '_').gsub(/_$/, '')
    end
    { classification:, classifier: 'heuristic', confidence: }
  end

  def match_vehicle_classifications(normalized, stemmed, vehicle_classifications)
    vehicle_classifications.each_with_object([]) do |classification, results|
      next if classification.keywords.blank?
      next unless classify_keywords(stemmed, classification.keywords)

      confidence = calculate_confidence(
        normalized, classification.name,
        context_words: [],
        keywords: classification.keywords
      )
      results << { classification:, classifier: 'heuristic', confidence: }
    end
  end

  def calculate_confidence(normalized, name, context_words:, keywords:, conflicting_context: [])
    stemmed = normalized.gsub(/[^a-z0-9\s]/, '').split.map(&:stem).join(' ')
    matched = keywords.count { |kw| phrase_match?(stemmed, kw) }
    ratio = matched.to_f / keywords.size

    confidence = 0.4 + (ratio * 0.3)
    confidence += context_score(normalized, context_words, conflicting_context)
    confidence += 0.1 if normalized.match?(/\b#{Regexp.escape(name.downcase)}\b/)
    confidence.clamp(0.0, 1.0).round(2)
  end

  def context_score(normalized, context_words, conflicting_context)
    score = 0.0
    if context_words.any?
      if context_words.any? { |w| normalized.include?(w) }
        score += 0.4
      else
        score -= 0.2
      end
    end
    score -= 0.2 if conflicting_context.any? { |w| normalized.include?(w) }
    score
  end

  def classify_keywords(stemmed, tokens)
    tokens.any? { |token| phrase_match?(stemmed, token) }
  end

  def phrase_match?(stemmed, token)
    words = token.split
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
