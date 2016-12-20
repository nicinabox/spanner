module V2
  class RemindersController < ApplicationController
    def index
      render json: reminders.all
    end

    def create
      reminder = reminders.build(reminder_params)

      reminder.save!
      render json: reminder
    end

    def update
      reminder = reminders.find(params[:id])

      reminder.update_attributes!(reminder_params)
      render json: reminder
    end

    def destroy
      record = reminders.find(params[:id])

      record.destroy!
      render :success
    end

    private

    def reminders
      vehicle.reminders
    end

    def vehicle
      vehicles.find(params[:vehicle_id])
    end

    def vehicles
      current_user.vehicles
    end

    def reminder_params
      params.require(:reminder).permit(:reminder)
    end
  end
end
