# frozen_string_literal: true

module V2
  class UsersController < ApplicationController
    skip_before_action :authenticate, only: %i[confirm_email unsubscribe]

    def index
      render json: current_user
    end

    def update
      current_user.update!(user_params)
      render json: current_user
    end

    # Authenticated. Begins an email change request for the current user.
    # Stores the requested (new) email and enqueues confirmation emails to
    # both the new and old addresses. The current `email` is unchanged until
    # the new address is confirmed via #confirm_email.
    def request_email_change
      new_email = params.dig(:user, :email).to_s.strip
      return respond_with_error('Email is required', status: :unprocessable_entity) if new_email.blank?

      current_user.request_email_change!(new_email)

      mailer_host = params[:host].presence || request.base_url
      EmailChangeMailer.confirm_email(current_user, host: mailer_host).deliver_later
      EmailChangeMailer.notify_old_email(current_user).deliver_later

      head :no_content
    rescue ActiveRecord::RecordInvalid
      respond_with_errors(current_user)
    end

    # Public (no auth). Redeems an email change confirmation token and
    # commits the new email.
    def confirm_email
      if User.confirm_email_change!(params[:token])
        render json: { message: 'Your email has been updated.' }, status: :ok
      else
        respond_with_error 'Invalid or expired email confirmation link', status: 401
      end
    end

    def destroy
      current_user.destroy
      head :no_content
    end

    def unsubscribe
      user = User.find_by(unsubscribe_token: params[:token])

      return render json: { message: 'Invalid or expired unsubscribe link.' }, status: :ok unless user

      user.update!(unsubscribed_at: Time.zone.now, unsubscribe_token: nil)
      render json: { message: "You've been unsubscribed. You'll no longer receive email reminders." }, status: :ok
    end

    private

    def user_params
      params
        .require(:user)
        .permit(:time_zone_offset,
                preferences: [
                  vehicles_sort_order: []
                ])
    end
  end
end
