# frozen_string_literal: true

class ApplicationController < ActionController::API
  include ErrorSerializer
  include ErrorLogging
  include ActionController::HttpAuthentication::Token::ControllerMethods

  before_action :authenticate
  before_action :set_active_storage_url_options

  rescue_from StandardError do |e|
    log_exception(e)
    Sentry.capture_exception(e)
    respond_with_error(e.message, status: 500)
  end

  rescue_from ActiveRecord::RecordNotFound do |e|
    log_exception(e)
    respond_with_error(e.message, status: :not_found)
  end

  rescue_from ActiveRecord::RecordInvalid do |e|
    log_exception(e)
    respond_with_errors(e.record)
  end

  rescue_from ActionController::ParameterMissing do |e|
    log_exception(e)
    respond_with_error(e.message, status: :unprocessable_entity)
  end

  protected

  attr_reader :current_user, :current_session

  def authenticate
    authenticate_token || render_unauthorized
  end

  def authenticate_token
    authenticate_with_http_token do |token, _options|
      session = Session.where(auth_token: token)
                       .where('auth_token_valid_until > ?', Time.zone.now)
                       .first

      if session
        session.update(
          ip: remote_ip,
          last_seen: Time.zone.now,
          auth_token_valid_until: 2.months.from_now
        )

        session.user.update(time_zone_offset: time_zone_offset) if time_zone_offset

        @current_session = session
        @current_user = session.user
      end
    end
  end

  def remote_ip
    request.remote_ip
  end

  def time_zone_offset
    request.headers['HTTP_TIME_ZONE_OFFSET']
  end

  def set_active_storage_url_options
    ActiveStorage::Current.url_options = Rails.application.routes.default_url_options.dup
  end

  def render_unauthorized
    respond_with_error 'Bad credentials', status: :unauthorized
  end

  def respond_with_errors(object)
    render json: {
      errors: ErrorSerializer.serialize(object)
    }, status: :unprocessable_content
  end

  def respond_with_error(detail, **args)
    render({
      json: {
        error: ErrorSerializer.serialize(detail)
      }
    }.merge(args))
  end

  def respond_with_message(detail, **args)
    render({
      json: {
        message: ErrorSerializer.serialize(detail)
      }
    }.merge(args))
  end
end
