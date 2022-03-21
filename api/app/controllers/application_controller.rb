include ErrorSerializer

class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  before_action :authenticate
  before_bugsnag_notify :add_user_info_to_bugsnag

  rescue_from StandardError do |e|
    logger.debug e
    Bugsnag.notify(e) unless ENV['development']
    respond_with_error(e.message, status: 500)
  end

  rescue_from ActiveRecord::RecordNotFound do |e|
    logger.debug e
    respond_with_error(e.message, status: :not_found)
  end

  rescue_from ActiveRecord::RecordInvalid do |invalid|
    logger.debug invalid
    respond_with_errors(invalid.record)
  end

  rescue_from ActionController::ParameterMissing do |e|
    logger.debug e
    respond_with_error(e.message, status: :unprocessable_entity)
  end

  protected
  def add_user_info_to_bugsnag(notification)
    notification.user = {
      email: current_user.email,
      id: current_user.id
    }
  end

  def current_user
    @current_user
  end

  def current_session
    @current_session
  end

  def authenticate
    authenticate_token || render_unauthorized
  end

  def authenticate_token
    authenticate_with_http_token do |token, options|
      session = Session.where(auth_token: token)
                       .where('auth_token_valid_until > ?', Time.now)
                       .first

      if session
        session.update_attributes(
          ip: remote_ip,
          last_seen: Time.now,
          auth_token_valid_until: Time.now + 2.months
        )

        session.user.update_attributes(time_zone_offset: time_zone_offset)

        @current_session = session
        @current_user = session.user
      end
    end
  end

  def remote_ip
    request.remote_ip
  end

  def time_zone_offset
    request.headers['HTTP_TIME_ZONE_OFFSET'] || "0"
  end

  def render_unauthorized
    respond_with_error 'Bad credentials', status: :unauthorized
  end

  def respond_with_errors(object)
    render json: {
      errors: ErrorSerializer.serialize(object)
    }, status: :unprocessable_entity
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
