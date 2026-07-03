# frozen_string_literal: true

module V2
  class ServiceSchedulesController < ApplicationController
    def index
      render json: schedules.all
    end

    def show
      render json: schedules.find(params[:id])
    end

    def create
      schedule = schedules.build(schedule_params)
      schedule.save!
      apply_classification_to_matching_records(schedule.classification)
      schedule.recalculate_next_due
      render json: schedule
    end

    def update
      schedule = schedules.find(params[:id])
      schedule.update!(schedule_params)
      schedule.recalculate_next_due
      render json: schedule
    end

    def destroy
      schedule = schedules.find(params[:id])
      classification = schedule.classification
      schedule.destroy!
      remove_orphaned_classification(classification)
      head :no_content
    end

    def complete
      schedule = schedules.find(params[:id])
      schedule.complete!(
        notes: params[:notes],
        date: params[:date],
        mileage: params[:mileage]
      )
      render json: schedule
    end

    private

    def schedules
      vehicle.service_schedules
    end

    def vehicle
      vehicles.find(params[:vehicle_id])
    end

    def vehicles
      current_user.vehicles
    end

    def schedule_params
      params.expect(
        service_schedule: %i[classification_id distance_interval month_interval notes enabled]
      )
    end

    def apply_classification_to_matching_records(classification)
      vehicle.records.find_each do |record|
        next if record.notes.blank?
        next if record.classifications.include?(classification)

        HeuristicClassifier.classify(record.notes, vehicle: vehicle).each do |result|
          next unless result[:classification].id == classification.id

          record.record_classifications.find_or_create_by(
            classification: classification
          ) do |rc|
            rc.classifier = result[:classifier]
            rc.confidence = result[:confidence]
            rc.auto_tagged = true
          end
        end
      end
    end

    def remove_orphaned_classification(classification)
      return if vehicle.service_schedules.where(classification: classification).any?

      vehicle.records.find_each do |record|
        record.record_classifications.where(classification: classification, auto_tagged: true).destroy_all
      end
    end
  end
end
