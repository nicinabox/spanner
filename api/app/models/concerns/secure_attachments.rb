# frozen_string_literal: true

module SecureAttachments
  extend ActiveSupport::Concern

  ALLOWED_CONTENT_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'image/heic', 'image/heif', 'image/avif',
    'application/pdf', 'text/plain', 'text/rtf'
  ].freeze

  MAX_ATTACHMENT_SIZE = 10.megabytes
  MAX_ATTACHMENT_COUNT = 10

  included do
    has_many_attached :attachments, dependent: :purge

    validate :attachment_content_types
    validate :attachment_sizes
    validate :attachment_count
  end

  class SecureAttachmentError < StandardError
  end

  # Class methods for validation (called before attaching)
  class << self
    def validate_files!(attachables)
      Array(attachables).each do |file|
        next unless file.respond_to?(:size)

        # Size check
        if file.size > MAX_ATTACHMENT_SIZE
          raise SecureAttachmentError,
                "file '#{filename(file)}' exceeds #{MAX_ATTACHMENT_SIZE / 1.megabyte}MB size limit"
        end

        # Content type check
        content_type = detect_content_type(file)
        unless ALLOWED_CONTENT_TYPES.include?(content_type)
          raise SecureAttachmentError, "content type '#{content_type}' is not allowed"
        end

        # Magic bytes check
        validate_magic_bytes!(file, content_type)
      end
    end

    private

    def filename(file)
      if file.respond_to?(:original_filename)
        file.original_filename
      else
        file.respond_to?(:filename) ? file.filename : 'unknown'
      end
    end

    def detect_content_type(file)
      if file.respond_to?(:content_type) && file.content_type.present?
        file.content_type
      elsif file.respond_to?(:path)
        Marcel::MimeType.for(Pathname.new(file.path))
      else
        'application/octet-stream'
      end
    end

    def validate_magic_bytes!(file, content_type)
      signatures = {
        'image/jpeg' => "\xFF\xD8\xFF".b,
        'image/png' => "\x89PNG\r\n\x1A\n".b,
        'image/gif' => 'GIF8'.b,
        'image/webp' => 'RIFF'.b,
        'application/pdf' => '%PDF'.b,
        'text/rtf' => '{\
tf'.b
      }

      return unless signatures.key?(content_type)

      expected = signatures[content_type]
      expected_bytes = read_bytes(file, expected.bytesize)
      return if expected_bytes.nil?

      raise SecureAttachmentError, 'content does not match declared type' unless expected_bytes.start_with?(expected)
    end

    def read_bytes(file, size)
      file.rewind
      file.read(size)&.force_encoding('BINARY')
    rescue StandardError
      nil
    end
  end

  private

  def attachment_content_types
    return if attachments.blank?

    attachments.each do |attachment|
      next if attachment.blob.nil?

      unless ALLOWED_CONTENT_TYPES.include?(attachment.blob.content_type)
        errors.add(:attachments, "type '#{attachment.blob.content_type}' is not allowed")
      end
    end
  end

  def attachment_sizes
    return if attachments.blank?

    attachments.each do |attachment|
      next if attachment.blob.nil?

      if attachment.blob.byte_size > MAX_ATTACHMENT_SIZE
        errors.add(:attachments, "exceeds #{MAX_ATTACHMENT_SIZE / 1.megabyte}MB size limit")
      end
    end
  end

  def attachment_count
    return if attachments.count <= MAX_ATTACHMENT_COUNT

    errors.add(:attachments, "count exceeds maximum of #{MAX_ATTACHMENT_COUNT}")
  end
end
