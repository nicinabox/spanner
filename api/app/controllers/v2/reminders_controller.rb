module V2
  class RemindersController < ApplicationController
    def index
      if params[:vehicle_id]
        render json: reminders.all
      else
        render json: current_user.reminders.all
      end
    end

    def show
      render json: reminders.find(params[:id])
    end

    def create
      reminder = reminders.build(reminder_params)

      reminder.save!
      render json: reminder
    end

    def update
      reminder = reminders.find(params[:id])

      reminder.update!(reminder_params)
      render json: reminder
    end

    def destroy
      record = reminders.find(params[:id])

      record.destroy!
      head :no_content
    end

    def estimate_date
      reminder = reminders.build(reminder_params)
      reminder.set_reminder_date!

      render json: {
        reminder_date: reminder.reminder_date
      }
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
      params.require(:reminder).permit(:notes, :date, :mileage, :reminder_type)
    end
  end
end
