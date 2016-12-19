module V2
  class SessionsController < ApplicationController
    skip_before_action :authenticate, only: [:create, :login]

    def index
      render json: current_user.sessions
    end

    def create
      user = User.find_or_create_by!(email: params[:email])

      user.update!(
        login_token: SecureRandom.urlsafe_base64,
        login_token_valid_until: Time.now + 15.minutes
      )

      LoginMailer.login_link(user).deliver

      render :success, status: 204
    end

    def login
      user = User.where(login_token: params[:login_token])
                 .where('login_token_valid_until > ?', Time.now)
                 .first

      if user
        user.update!(
          login_token: nil,
          login_token_valid_until: 1.year.ago,
        )
        session = user.sessions.build(
          ip: request.remote_ip,
          description: request.user_agent,
          auth_token: SecureRandom.urlsafe_base64(24)
        )
        session.save

        render json: session
      else
        respond_with_error 'Invalid or expired login link', status: 401
      end
    end

    def destroy
      @current_session.destroy!
      render :success, status: 204
    end
  end
end
