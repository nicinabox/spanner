# frozen_string_literal: true

module V2
  class ClassifyController < ApplicationController
    def classify
      notes = params[:notes]
      results = HeuristicClassifier.classify(notes)

      render json: results.map { |r|
        {
          classification: ClassificationSerializer.new(r[:classification]).serializable_hash,
          classifier: r[:classifier],
          confidence: r[:confidence]
        }
      }
    end
  end
end
