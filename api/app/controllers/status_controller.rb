class StatusController < ApplicationController
  skip_before_action :authenticate, only: [:index, :apple_app_site_association]

  def index
    render text: 'Online'
  end

  def apple_app_site_association
    association_json = File.read(Rails.public_path + "apple-app-site-association")
    render :json => association_json, :content_type => "application/pkcs7-mime"
  end
end
