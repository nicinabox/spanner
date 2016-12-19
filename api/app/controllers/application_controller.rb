include ErrorSerializer

class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  before_action :authenticate

  protected

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
      session = Session.find_by(auth_token: token)

      if session
        @current_session = session
        @current_user = session.user
      end
    end
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
