class StatusController < ApplicationController
  skip_before_action :authenticate, only: [:index, :apple_app_site_association]

  def index
    render plain: 'Online'
  end
end
