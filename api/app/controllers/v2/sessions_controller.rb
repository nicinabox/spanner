# frozen_string_literal: true

require 'browser'

module V2
  class SessionsController < ApplicationController
    skip_before_action :authenticate, only: %i[create login]

    def index
      render json: current_user.sessions
    end

    def create
      email = params[:email].strip.downcase
      host = params[:host]
      user = User.find_by email: email

      unless user
        user = User.create! email: email, time_zone_offset: time_zone_offset
        PromptUserMailer.add_first_vehicle(user).deliver_later wait: 5.minutes
      end

      return head :no_content if user.demo_account?

      if user
        login_token = SecureRandom.urlsafe_base64
        user.update!(
          login_token: login_token,
          login_token_valid_until: 15.minutes.from_now
        )
        puts "Login token for user #{user.email}: #{login_token}" if Rails.env.development?

        if params[:platform] == 'mobile'
          LoginMailer.login_token(user).deliver_later
        else
          LoginMailer.login_link(user, host: host).deliver_later
        end

        render :success, status: :no_content
      else
        respond_with_errors(user)
      end
    end

    def login
      user = User.where(login_token: params[:login_token])
                 .where('login_token_valid_until > ?', Time.zone.now)
                 .first

      if user
        browser = Browser.new(request.user_agent)
        name = request.user_agent =~ /Spanner/ ? 'Spanner iOS' : browser.name

        unless user.demo_account?
          user.update!(
            login_token: nil,
            login_token_valid_until: 1.year.ago
          )
        end

        session = user.sessions.build(
          ip: remote_ip,
          description: name || browser.name,
          user_agent: request.user_agent,
          last_seen: Time.zone.now,
          auth_token: SecureRandom.urlsafe_base64(24),
          auth_token_valid_until: 2.months.from_now
        )
        session.save
        session.user.update!(time_zone_offset: time_zone_offset)

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
  end
end
