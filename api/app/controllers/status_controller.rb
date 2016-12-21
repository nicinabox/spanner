class StatusController < ApplicationController
  skip_before_action :authenticate, only: :index

  def index
    render text: 'Online'
  end
end
