module V2
  class UsersController < ApplicationController
    def index
      render json: current_user
    end

    def update
      current_user.update_attributes!(user_params)
      render json: current_user
    end

    private

    def user_params
      params.require(:user).permit(:email)
    end
  end
end
