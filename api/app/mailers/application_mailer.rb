# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  include ActionView::Helpers::DateHelper

  attr_reader :web_url

  default from: ENV.fetch('FROM_EMAIL', 'noreply@localhost')
  layout 'mailer'

  helper_method :logo_data_uri, :web_preferences_url

  def default_url_options
    base = web_url || Rails.application.config.x.web_url
    uri = URI.parse(base)
    { host: uri.host, port: uri.port, protocol: uri.scheme }
  end

  def logo_data_uri
    return @logo_data_uri if defined?(@logo_data_uri)

    path = Rails.public_path.join('images/app-icon-color.png')
    data = path.read
    encoded = Base64.strict_encode64(data)

    @logo_data_uri = "data:image/png;base64,#{encoded}"
  end

  def web_preferences_url(token:, vehicle_id: nil)
    base = @web_url || Rails.application.config.x.web_url
    path = "/preferences/#{token}"
    path += "?vehicle_id=#{vehicle_id}" if vehicle_id
    "#{base}#{path}"
  end

  def web_reset_password_url(token:)
    base = @web_url || Rails.application.config.x.web_url
    "#{base}/reset-password/#{token}"
  end
end
