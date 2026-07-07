# frozen_string_literal: true

module V2
  class ReclassifyController < ApplicationController
    def reclassify
      vehicle = vehicles.find(params[:id])
      updated = 0

      vehicle.records.find_each do |record|
        next if record.notes.blank?

        HeuristicClassifier.classify(record.notes, vehicle:).each do |result|
          next if record.record_classifications.exists?(classification_id: result[:classification].id)

          record.record_classifications.create!(
            classification: result[:classification],
            classifier: result[:classifier],
            confidence: result[:confidence],
            auto_tagged: true
          )
        end
        updated += 1
      end

      vehicle.service_schedules.each(&:recalculate_next_due)

      render json: { records_updated: updated }
    end

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

    private

    def vehicles
      current_user.vehicles
    end
  end
end
