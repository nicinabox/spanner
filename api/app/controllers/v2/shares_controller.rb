# frozen_string_literal: true

module V2
  class SharesController < ApplicationController
    before_action :authenticate

    # GET /v2/shares/pending
    def pending
      shares = current_user.vehicle_shares.pending.includes(:vehicle, :invited_by)
      render json: shares.as_json(include: {
                                    vehicle: { only: %i[id name] },
                                    invited_by: { only: %i[id email] }
                                  })
    end

    # GET /v2/vehicles/:vehicle_id/shares
    def index
      vehicle = current_user.vehicles.find(params[:vehicle_id])
      shares = vehicle.vehicle_shares.includes(:user, :invited_by)
      render json: shares.as_json(include: {
                                    user: { only: %i[id email] },
                                    invited_by: { only: %i[id email] }
                                  })
    end

    # POST /v2/vehicles/:vehicle_id/shares
    def create
      vehicle = current_user.vehicles.find(params[:vehicle_id])

      user = User.find_by(email: params[:email].strip.downcase)
      return respond_with_error 'No account found with that email', status: :not_found if user.nil?

      if user == current_user
        return respond_with_error 'Cannot share a vehicle with yourself', status: :unprocessable_entity
      end

      share = vehicle.vehicle_shares.create!(
        user: user,
        invited_by: current_user
      )

      render json: share, status: :created
    rescue ActiveRecord::RecordInvalid => e
      respond_with_errors(e.record)
    end

    # DELETE /v2/vehicles/:vehicle_id/shares/:id
    def destroy
      vehicle = current_user.vehicles.find(params[:vehicle_id])
      share = vehicle.vehicle_shares.find(params[:id])
      share.destroy!
      head :no_content
    end

    # POST /v2/shares/:id/accept
    def accept
      share = current_user.vehicle_shares.pending.find(params[:id])
      share.accept!
      render json: share
    end

    # DELETE /v2/shares/:id/decline
    def decline
      share = current_user.vehicle_shares.pending.find(params[:id])
      share.destroy!
      head :no_content
    end
  end
end
