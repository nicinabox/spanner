# frozen_string_literal: true

module V2
  class LoginsController < ApplicationController
    include SessionCreation
    skip_before_action :authenticate, only: %i[create]

    def create
      email = params[:email].to_s.strip.downcase
      password = params[:password].presence

      user = User.unscoped.find_by(email: email)

      # Always consume bcrypt time to prevent timing-based enumeration.
      dummy_hash = BCrypt::Password.create(SecureRandom.hex)
      stored_hash = user&.password_digest || dummy_hash
      bcrypt = BCrypt::Password.new(stored_hash)

      if user && user.password_enabled? && password.present? && bcrypt.is_password?(password)
        session = create_session!(user)
        render json: session
        return
      end

      # Password provided but didn't match (or email doesn't exist) → 401
      if password.present?
        respond_with_error 'Invalid email or password', status: :unauthorized
        return
      end

      # No password provided — magic link flow
      if user && !user.password_enabled?
        # Existing account without a password → send magic link
        send_magic_link(user)
      elsif user.nil?
        # New user → create account and send magic link
        user = User.create!(email: email, time_zone_offset: time_zone_offset)
        PromptUserMailer.add_first_vehicle(user).deliver_later wait: 5.minutes
        send_magic_link(user)
      end
      # Password account with no password provided → 202, no email (ambiguous)

      head :accepted
    end

    private

    def send_magic_link(user)
      login_token = SecureRandom.urlsafe_base64
      user.update!(
        login_token: login_token,
        login_token_valid_until: 15.minutes.from_now
      )

      if params[:platform] == 'mobile'
        LoginMailer.login_token(user).deliver_later
      else
        LoginMailer.login_link(user, host: params[:host]).deliver_later
      end
    end
  end
end
