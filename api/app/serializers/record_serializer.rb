# frozen_string_literal: true

class RecordSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :created_at, :updated_at, :date, :cost, :mileage, :notes, :record_type, :vehicle_id, :attachments

  has_many :classifications, serializer: ClassificationSerializer

  def attachments
    object.attachments.map do |attachment|
      {
        id: attachment.signed_id,
        filename: attachment.filename.to_s,
        content_type: attachment.content_type,
        byte_size: attachment.byte_size,
        url: attachment_url(attachment)
      }
    end
  end

  private

  def attachment_url(attachment)
    attachment.url(expires_in: 7.days)
  rescue ArgumentError
    rails_blob_url(attachment.blob, expires_in: 7.days, only_path: true)
  end
end
