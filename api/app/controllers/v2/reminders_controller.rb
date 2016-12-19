module V2
  class RemindersController < ApplicationController
    def index
      reminders = vehicles.find(params[:vehicle_id]).reminders
      render json: reminders.all
    end

    def create
      vehicle = vehicles.find(params[:vehicle_id])
      reminder = vehicle.reminders.build(reminder_params)

      if reminder.save
        render json: reminder
      else
        respond_with_errors(reminder)
      end
    end

    def update
      reminder = vehicles.reminders.find(params[:id])

      if reminder.update_attributes(reminder_params)
        render json: reminder
      else
        respond_with_errors(reminder)
      end
    end

    def destroy
      vehicles.reminders.destroy(params[:id])
    end

    private

    def vehicles
      current_user.vehicles
    end

    def reminder_params
      params.require(:reminder).permit(:reminder)
    end
  end
end
