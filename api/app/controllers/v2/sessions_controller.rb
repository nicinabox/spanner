require "browser"

module V2
  class SessionsController < ApplicationController
    skip_before_action :authenticate, only: [:create, :login]

    def index
      render json: current_user.sessions
    end

    def create
      email = params[:email].strip.downcase
      host = params[:host]
      user = User.find_by_email email

      if not user
        user = User.create! email: email, time_zone_offset: time_zone_offset
        PromptUserMailer.add_first_vehicle(user).deliver_later wait: 5.minutes
      end

      if user.demo_account?
        return render :success, status: 204
      end

      if user
        user.update!(
          login_token: SecureRandom.urlsafe_base64,
          login_token_valid_until: Time.now + 15.minutes
        )

        if params[:platform] == 'mobile'
          LoginMailer.login_token(user).deliver_later
        else
          LoginMailer.login_link(user, host).deliver_later
        end

        render :success, status: 204
      else
        respond_with_errors(user)
      end
    end

    def login
      user = User.where(login_token: params[:login_token])
                 .where('login_token_valid_until > ?', Time.now)
                 .first

      if user
        browser = Browser.new(request.user_agent)
        name = request.user_agent =~ /Spanner/ ? 'Spanner iOS' : browser.name

        unless user.demo_account?
          user.update!(
            login_token: nil,
            login_token_valid_until: 1.year.ago,
          )
        end

        session = user.sessions.build(
          ip: remote_ip,
          description: name || browser.name,
          user_agent: request.user_agent,
          last_seen: Time.now,
          auth_token: SecureRandom.urlsafe_base64(24),
          auth_token_valid_until: Time.now + 2.months,
        )
        session.save
        session.user.update_attributes(time_zone_offset: time_zone_offset)

        render json: session
      else
        respond_with_error 'Invalid or expired login link', status: 401
      end
    end

    def destroy
      session = current_user.sessions.find(params[:id])
      if session
        session.destroy!
        render :success, status: 204
      end
    end
  end
end
