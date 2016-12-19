module V2
  class UsersController < ApplicationController
    def index
      render json: current_user
    end
  end
end
