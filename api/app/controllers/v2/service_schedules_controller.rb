# frozen_string_literal: true

module V2
  class ServiceSchedulesController < ApplicationController
    def index
      render json: schedules.all
    end

    def show
      render json: schedules.find(params[:id]), include: :classification
    end

    def create
      classification = find_or_create_classification
      schedule = schedules.build(schedule_params.merge(classification_id: classification.id))
      schedule.save!
      begin
        apply_classification_to_matching_records(schedule.classification)
      rescue StandardError => e
        Rails.logger.error("Failed to apply classification to records: #{e.message}")
      end
      schedule.recalculate_next_due
      render json: schedule
    end

    def batch
      schedules_data = params.require(:service_schedule)
      return head :unprocessable_content if schedules_data.blank?

      results = schedules_data.map do |s|
        classification = find_or_create_classification(s)
        schedule = schedules.build(
          classification_id: classification.id,
          distance_interval: s[:distance_interval],
          month_interval: s[:month_interval],
          notes: s[:notes],
          enabled: s.fetch(:enabled, true)
        )
        schedule.save!
        begin
          apply_classification_to_matching_records(schedule.classification)
        rescue StandardError => e
          Rails.logger.error("Failed to apply classification to records: #{e.message}")
        end
        schedule.recalculate_next_due
        schedule
      end

      render json: results
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

      if params[:record_id]
        record = schedule.vehicle.records.find(params[:record_id])
        schedule.update!(last_completed_record_id: record.id)
        schedule.recalculate_next_due
      else
        schedule.complete!(
          notes: params[:notes],
          date: params[:date],
          mileage: params[:mileage]
        )
      end

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

    def find_or_create_classification(source = nil)
      source ||= params[:service_schedule]

      if source && source[:classification_id].present?
        vehicle.classifications.find(source[:classification_id])
      elsif source && source[:classification_name].present?
        name = source[:classification_name]
        keywords = source[:keywords].presence || [name.downcase]
        classification = vehicle.classifications.where(name:).first_or_initialize
        classification.keywords = keywords
        classification.save!
        classification
      else
        raise ActionController::ParameterMissing, 'classification_id or classification_name required'
      end
    end

    def apply_classification_to_matching_records(classification)
      classifier = HeuristicClassifier.new
      vehicle.records.find_each do |record|
        next if record.notes.blank?
        next if record.classifications.include?(classification)

        classifier.classify(record.notes, vehicle: vehicle).each do |result|
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
        record.record_classifications.where(classification: classification).destroy_all
      end
    end
  end
end
