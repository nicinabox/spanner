# frozen_string_literal: true

module V2
  class ReclassifyController < ApplicationController
    def create
      vehicle = vehicles.find(params[:id])
      updated = 0

      vehicle.records.find_each do |record|
        record.record_classifications.auto_tagged.destroy_all

        HeuristicClassifier.classify(record.notes, vehicle:).each do |result|
          record.record_classifications.find_or_create_by!(
            classification: result[:classification]
          ) do |rc|
            rc.classifier = result[:classifier]
            rc.confidence = result[:confidence]
            rc.auto_tagged = true
          end
        end
        updated += 1
      end

      vehicle.service_schedules.each(&:recalculate_next_due)

      render json: { records_updated: updated }
    end

    private

    def vehicles
      current_user.vehicles
    end
  end
end