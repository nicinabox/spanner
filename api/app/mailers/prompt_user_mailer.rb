# frozen_string_literal: true

class PromptUserMailer < ApplicationMailer
  def add_record(user, vehicle)
    @user = user
    @vehicle = vehicle
    @unsubscribe_url = unsubscribe_url(@vehicle, action: :prompt)
    @remind_me_later_url = prompt_control_url(@vehicle, action: :remind_me_later)
    @mute_url = prompt_control_url(@vehicle, action: :mute)

    mail to: @user.email,
         subject: "Have you done anything to your #{vehicle.name} lately?"
  end

  def add_first_vehicle(user)
    @user = user

    mail to: @user.email,
         subject: 'Add your first vehicle'
  end

  def add_first_record(user, vehicle)
    @user = user
    @vehicle = vehicle

    mail to: @user.email,
         subject: "Add your first service to your #{vehicle.name}"
  end
end
