# frozen_string_literal: true

module V2
  class PasswordsController < ApplicationController
    include SessionCreation

    skip_before_action :authenticate, only: %i[create_reset reset]

    # PUT /password — set or change password
    # Session token is the auth proof — no current password required.
    def update
      if params[:password].to_s.length < 8
        respond_with_error 'Password is too short (minimum is 8 characters)', status: :unprocessable_content
        return
      end

      current_user.update!(password: params[:password])
      head :no_content
    end

    # POST /password/reset — request reset (always 202)
    def create_reset
      email = params[:email].to_s.strip.downcase
      user = User.unscoped.find_by(email: email)

      PasswordMailer.reset_link(user).deliver_later if user&.password_enabled?

      head :accepted
    end

    # POST /password/reset/:token — redeem reset token
    def reset
      user = User.find_by(password_reset_token: params[:token])

      if user
        if params[:password].to_s.length < 8
          respond_with_error 'Password is too short (minimum is 8 characters)', status: :unprocessable_content
          return
        end

        user.update!(password: params[:password])
        session = create_session!(user)
        render json: session
      else
        respond_with_error 'Invalid or expired reset token', status: :unauthorized
      end
    end
  end
end
