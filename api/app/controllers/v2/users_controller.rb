# frozen_string_literal: true

module V2
  class UsersController < ApplicationController
    skip_before_action :authenticate, only: %i[confirm_email account account_action account_preferences]

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

      EmailChangeMailer.confirm_email(current_user).deliver_later
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

    def account
      user = User.find_by(account_token: params[:token])
      return render json: { error: 'not_found' }, status: :not_found unless user

      payload = { unsubscribed_at: user.unsubscribed_at&.iso8601 }

      if params[:vehicle_id].present?
        vehicle = user.vehicles.find_by(id: params[:vehicle_id])
        return render json: { error: 'not_found' }, status: :not_found unless vehicle

        payload[:vehicle] = {
          id: vehicle.id,
          name: vehicle.name,
          preferences: {
            send_reminder_emails: vehicle.preferences.send_reminder_emails,
            send_prompt_for_records: vehicle.preferences.send_prompt_for_records
          }
        }
      end

      render json: payload, status: :ok
    end

    def account_action
      user = User.find_by(account_token: params[:token])
      return render json: { error: 'not_found' }, status: :not_found unless user

      case params[:action_type]
      when 'unsubscribe'
        user.update!(unsubscribed_at: Time.zone.now)
      when 'reactivate'
        user.update!(unsubscribed_at: nil)
      else
        return render json: { error: 'unknown_action' }, status: :unprocessable_content
      end

      render json: { unsubscribed_at: user.unsubscribed_at&.iso8601 }, status: :ok
    end

    def account_preferences
      user = User.find_by(account_token: params[:token])
      return render json: { error: 'not_found' }, status: :not_found unless user

      vehicle_id = params[:vehicle_id]
      return render json: { error: 'vehicle_id_required' }, status: :unprocessable_content if vehicle_id.blank?

      vehicle = user.vehicles.find_by(id: vehicle_id)
      return render json: { error: 'not_found' }, status: :not_found unless vehicle

      vehicle.update!(
        preferences: vehicle.preferences.to_hash.merge(
          'send_reminder_emails' => ActiveModel::Type::Boolean.new.cast(params[:send_reminder_emails]),
          'send_prompt_for_records' => ActiveModel::Type::Boolean.new.cast(params[:send_prompt_for_records])
        )
      )

      render json: {
        preferences: {
          send_reminder_emails: vehicle.preferences.send_reminder_emails,
          send_prompt_for_records: vehicle.preferences.send_prompt_for_records
        }
      }, status: :ok
    end

    private

    def user_params
      params
        .require(:user)
        .permit(:time_zone_offset,
                preferences: [
                  { vehicles_sort_order: [] },
                  :webhook_url
                ])
    end
  end
end
