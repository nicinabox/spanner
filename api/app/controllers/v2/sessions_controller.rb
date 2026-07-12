# frozen_string_literal: true

require 'browser'

module V2
  class SessionsController < ApplicationController
    include SessionCreation

    skip_before_action :authenticate, only: %i[create login]

    def index
      render json: current_user.sessions
    end

    def create
      email = params[:email].strip.downcase
      user = User.unscoped.find_by(email: email)

      user.restore! if user&.deleted?

      unless user
        user = User.create! email: email, time_zone_offset: time_zone_offset
        PromptUserMailer.add_first_vehicle(user).deliver_later wait: 5.minutes
      end

      if user
        issue_login_token(user)
        head :no_content
      else
        respond_with_errors(user)
      end
    end

    def login
      user = User.where(login_token: params[:login_token])
        .where('login_token_valid_until > ?', Time.zone.now)
        .first

      if user
        session = create_session!(user)
        render json: session
      else
        respond_with_error 'Invalid or expired login link', status: 401
      end
    end

    def destroy
      session = current_user.sessions.find(params[:id])
      return unless session

      session.destroy!
      head :no_content
    end

    private

    def issue_login_token(user)
      login_token = SecureRandom.urlsafe_base64
      user.update!(
        login_token: login_token,
        login_token_valid_until: 15.minutes.from_now
      )
      Rails.logger.debug { "Login token for user #{user.email}: #{login_token}" } if Rails.env.development?

      if params[:platform] == 'mobile'
        LoginMailer.login_token(user).deliver_later
      else
        LoginMailer.login_link(user, web_url: web_base_url).deliver_later
      end
    end
  end
end
