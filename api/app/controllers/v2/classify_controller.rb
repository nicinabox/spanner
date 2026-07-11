# frozen_string_literal: true

module V2
  class ClassifyController < ApplicationController
    def classify
      vehicle = current_user.vehicles.find(params[:id])
      notes = params[:notes]
      results = HeuristicClassifier.classify(notes, vehicle:)

      schedule_classification_ids = vehicle.service_schedules.pluck(:classification_id)

      render json: results
        .select { |r| schedule_classification_ids.include?(r[:classification].id) }
        .map { |r|
          {
            classification: ClassificationSerializer.new(r[:classification]).serializable_hash,
            classifier: r[:classifier],
            confidence: r[:confidence]
          }
        }
    end
  end
end
