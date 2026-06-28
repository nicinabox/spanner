# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  include ActionView::Helpers::DateHelper

  default from: ENV.fetch('FROM_EMAIL', 'noreply@localhost')
  layout 'mailer'

  helper_method :logo_data_uri, :frontend_preferences_url

  def logo_data_uri
    return @logo_data_uri if defined?(@logo_data_uri)

    path = Rails.public_path.join('images/app-icon-color.png')
    data = path.read
    encoded = Base64.strict_encode64(data)

    @logo_data_uri = "data:image/png;base64,#{encoded}"
  end

  def frontend_preferences_url(token, vehicle_id: nil)
    base = Rails.application.config.x.web_url.to_s.chomp('/')
    path = "/preferences/#{token}"
    path += "?vehicle_id=#{vehicle_id}" if vehicle_id
    "#{base}#{path}"
  end
end
