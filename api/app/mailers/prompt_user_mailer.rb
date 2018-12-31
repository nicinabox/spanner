class PromptUserMailer < ApplicationMailer

  def add_record(user, vehicle)
    @user = user
    @vehicle = vehicle

    mail to: @user.email,
      subject: "Have you done anything to your #{vehicle.name} lately?"
  end

  def add_first_vehicle(user)
    @user = user

    mail to: @user.email,
      subject: "Add your first vehicle"
  end

  def add_first_record(user, vehicle)
    @user = user
    @vehicle = vehicle

    mail to: @user.email,
      subject: "Add your first service to your #{vehicle.name}"
  end

end
