class StatusController < ApplicationController
  skip_before_action :authenticate, only: [:index, :apple_app_site_association]

  def index
    render text: 'Online'
  end
end
