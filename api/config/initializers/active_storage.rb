# frozen_string_literal: true

# Active Storage needs url_options to generate URLs for the Disk service
# (development/test). In production (S3), presigned URLs are generated directly
# and do not require this. We derive the values from the routes' default URL
# options set in each environment config.
Rails.application.config.after_initialize do
  ActiveStorage::Current.url_options = Rails.application.routes.default_url_options.dup
end
