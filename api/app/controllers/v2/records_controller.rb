# frozen_string_literal: true

module V2
  class RecordsController < ApplicationController
    skip_before_action :authenticate, only: [:share]

    def index
      render json: records.all
    end

    def show
      render json: records.find(params[:id])
    end

    def share
      vehicle = Vehicle.find(params[:vehicle_id])

      if vehicle.preferences.enable_sharing
        records = vehicle.records.all
        return render json: records
      end

      render_unauthorized
    end

    def create
      record = records.build(record_params)
      has_manual_ids = params.dig(:record, :classification_ids)

      validate_attachment_sizes!
      record.save!
      record.reload
      sync_classifications(record) if has_manual_ids
      record.attachments.attach(params[:record][:attachments]) if params[:record][:attachments].present?
      render json: record
    end

    def update
      record = records.find(params[:id])
      has_manual_ids = params.dig(:record, :classification_ids)

      validate_attachment_sizes!
      record.update!(record_params)
      record.reload
      sync_classifications(record) if has_manual_ids
      record.attachments.attach(params[:record][:attachments]) if params[:record][:attachments].present?
      purge_attachments!(record)
      render json: record
    end

    def destroy
      record = records.find(params[:id])

      record.destroy!
      head :no_content
    end

    def destroy_attachment
      record = records.find(params[:record_id])
      attachment = record.attachments.find { |a| a.signed_id == params[:signed_id] }

      raise ActiveRecord::RecordNotFound if attachment.nil?

      attachment.purge
      head :no_content
    end

    private

    def records
      vehicle.records
    end

    def vehicle
      vehicles.find(params[:vehicle_id])
    end

    def vehicles
      current_user.vehicles
    end

    def record_params
      params.require(:record).permit(:date, :cost, :mileage, :notes, :record_type)
    end

    def sync_classifications(record)
      ids = params.dig(:record, :classification_ids)
      return unless ids

      record.sync_manual_classifications(ids)
    end

    def validate_attachment_sizes!
      uploaded = params[:record][:attachments]
      return if uploaded.blank?

      Array(uploaded).each do |file|
        next unless file.respond_to?(:size)

        next unless file.size > Record::MAX_ATTACHMENT_SIZE

        raise(ActiveRecord::RecordInvalid, Record.new.tap do |r|
          r.errors.add(:attachments, 'exceeds the 10MB size limit')
        end)
      end
    end

    def purge_attachments!(record)
      signed_ids = params.dig(:record, :attachments_to_delete)
      return if signed_ids.blank?

      record.attachments.each do |attachment|
        attachment.purge if signed_ids.include?(attachment.signed_id)
      end
    end
  end
end
