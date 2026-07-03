# frozen_string_literal: true

module V2
  class ShareLinksController < ApplicationController
    skip_before_action :authenticate, only: %i[show records]
    before_action :authenticate, only: %i[index create destroy]

    # GET /v2/vehicles/:vehicle_id/share_links
    def index
      vehicle = current_user.vehicles.find(params[:vehicle_id])
      render json: vehicle.share_links
    end

    # GET /share/vehicles/:token
    def show
      link = ShareLink.find_by!(token: params[:token])
      render json: link.vehicle
    rescue ActiveRecord::RecordNotFound
      respond_with_error 'Vehicle not found', status: :not_found
    end

    # POST /v2/vehicles/:vehicle_id/share_links
    def create
      vehicle = current_user.vehicles.find(params[:vehicle_id])
      link = vehicle.share_links.create!
      render json: link, status: :created
    end

    # DELETE /v2/vehicles/:vehicle_id/share_links/:id
    def destroy
      vehicle = current_user.vehicles.find(params[:vehicle_id])
      link = vehicle.share_links.find_by!(token: params[:id])
      link.destroy!
      head :no_content
    end

    # GET /share/vehicles/:token/records
    def records
      link = ShareLink.find_by!(token: params[:token])
      render json: link.vehicle.records.all
    rescue ActiveRecord::RecordNotFound
      respond_with_error 'Vehicle not found', status: :not_found
    end
  end
end
