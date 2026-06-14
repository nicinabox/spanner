# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  include ActionView::Helpers::DateHelper

  default from: 'spanner@nicinabox.com'
  layout 'mailer'

  helper_method :logo_data_uri
  helper_method :unsubscribe_url
  helper_method :prompt_control_url

  def logo_data_uri
    return @logo_data_uri if defined?(@logo_data_uri)

    path = Rails.root.join('public/images/email-logo.png')
    data = path.read
    encoded = Base64.strict_encode64(data)

    @logo_data_uri = "data:image/png;base64,#{encoded}"
  end

  def unsubscribe_url(vehicle, action: :reminders)
    token = NotificationToken.generate(
      vehicle_id: vehicle.id,
      action: action.to_s
    )

    routes.unsubscribe_url(token: token)
  end

  def prompt_control_url(vehicle, action:)
    token = NotificationToken.generate(
      vehicle_id: vehicle.id,
      action: action.to_s
    )

    case action.to_sym
    when :remind_me_later
      routes.remind_me_later_url(token: token)
    when :mute
      routes.mute_prompt_url(token: token)
    end
  end

  private

  def routes
    Rails.application.routes.default_url_options = default_url_options
    Rails.application.routes.url_helpers
  end

  def default_url_options
    ActionMailer::Base.default_url_options
  end
end
