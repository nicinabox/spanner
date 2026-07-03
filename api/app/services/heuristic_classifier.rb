# frozen_string_literal: true

class HeuristicClassifier < NoteClassifier
  KEYWORDS = {
    oil_change: [
      'oil change',
      'change oil',
      'changed oil',
      'oil changed',
      'engine oil',
      'motor oil',
      'oil filter',
      'oil and filter',
      'filter and oil'
    ],
    tire_rotation: [
      'tire rotation',
      'rotate tires',
      'rotated tires',
      'rotate tyres',
      'rotated tyres',
      'tire rotated'
    ],
    air_filter: [
      'air filter',
      'engine air filter',
      'replace air filter',
      'replaced air filter'
    ],
    battery: [
      'new battery',
      'replace battery',
      'replaced battery',
      'battery replacement',
      'battery died',
      'battery dead'
    ],
    brake_fluid: [
      'brake fluid',
      'DOT3',
      'DOT4',
      'DOT5',
      'dot 3',
      'dot 4',
      'dot 5',
      'brake flush',
      'flushed brake'
    ],
    brakes: [
      'brake pads',
      'brake rotors',
      'rotors and pads',
      'rotors turned',
      'brake job',
      'brake service',
      'replace brakes',
      'replaced brakes'
    ],
    cabin_air_filter: [
      'cabin air filter',
      'cabin filter',
      'replace cabin filter',
      'replaced cabin filter'
    ],
    clutch: [
      'clutch fluid',
      'clutch replacement',
      'new clutch',
      'replace clutch',
      'replaced clutch'
    ],
    coolant: [
      'coolant',
      'antifreeze',
      'radiator fluid',
      'coolant flush',
      'flushed coolant'
    ],
    drive_belt: [
      'serpentine belt',
      'accessory belt',
      'timing belt',
      'drive belt',
      'replace belt',
      'replaced belt',
      'new belt'
    ],
    power_steering: [
      'power steering',
      'power steering fluid',
      'power steering oil'
    ],
    spark_plugs: [
      'spark plugs',
      'spark plug',
      'plug wires',
      'ngk',
      'replace spark plugs',
      'replaced spark plugs'
    ],
    transmission: [
      'transmission fluid',
      'transmission oil',
      'gearbox oil',
      'transmission service',
      'trans fluid',
      'trans service',
      'transmission flush'
    ]
  }.freeze

  def self.classify(text, **)
    new.classify(text, **)
  end

  def classify(text, vehicle: nil)
    normalized = text.to_s.downcase
    return [] if normalized.blank?

    vehicle_classifications = vehicle_classifications_for(vehicle)
    overridden_names = vehicle_classifications.map(&:name).map(&:downcase)

    match_system_keywords(normalized, overridden_names) +
      match_vehicle_classifications(normalized, vehicle_classifications)
  end

  private

  def vehicle_classifications_for(vehicle)
    return Classification.none unless vehicle

    vehicle.classifications.where.not(keywords: [])
  end

  def match_system_keywords(normalized, overridden_names)
    KEYWORDS.each_with_object([]) do |(key, tokens), results|
      classification = Classification.find_by(key: key)
      next unless classification
      next if overridden_names.include?(classification.name.downcase)

      next unless classify_keywords(normalized, tokens)

      results << classification_result(classification)
    end
  end

  def match_vehicle_classifications(normalized, vehicle_classifications)
    vehicle_classifications.each_with_object([]) do |classification, results|
      next if classification.keywords.blank?
      next unless classify_keywords(normalized, classification.keywords)

      results << classification_result(classification)
    end
  end

  def classification_result(classification)
    { classification: classification, classifier: 'heuristic', confidence: 1.0 }
  end

  def classify_keywords(text, tokens)
    tokens.any? { |token| phrase_match?(text, token) }
  end

  def phrase_match?(text, token)
    words = token.split
    return false if words.empty?

    return word_match?(text, words.first) if words.one?

    pattern = words.map { |word| Regexp.escape(word) }.join('[\s,;.]+')
    text.match?(/\b#{pattern}\b/i)
  end

  def word_match?(text, word)
    text.match?(/\b#{Regexp.escape(word)}\b/i)
  end
end
