# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  include ActionView::Helpers::DateHelper

  default from: ENV.fetch('FROM_EMAIL', 'noreply@localhost')
  layout 'mailer'

  helper_method :logo_data_uri

  def logo_data_uri
    return @logo_data_uri if defined?(@logo_data_uri)

    path = Rails.public_path.join('images/email-logo.png')
    data = path.read
    encoded = Base64.strict_encode64(data)

    @logo_data_uri = "data:image/png;base64,#{encoded}"
  end
end
