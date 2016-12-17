module V2
  class SessionsController < ApplicationController
    skip_before_action :authenticate, only: [:create, :login]

    def create
      user = User.find_or_create_by!(email: params[:email])

      user.update!(
        login_token: SecureRandom.urlsafe_base64,
        login_token_valid_until: Time.now + 15.minutes
      )

      LoginMailer.login_link(user).deliver

      render :success
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
          auth_token: SecureRandom.urlsafe_base64(24)
        )
        session.save

        render json: {
          id: user.id,
          email: user.email,
          auth_token: session.auth_token
        }
      else
        render json: 'Invalid or expired login link', status: 401
      end
    end

    def destroy
      current_user.update!(auth_token: nil)
      render json: 'Bye!'
    end
  end
end
