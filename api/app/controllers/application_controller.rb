class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  before_action :authenticate

  protected

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
    render json: 'Bad credentials', status: :unauthorized
  end
end
