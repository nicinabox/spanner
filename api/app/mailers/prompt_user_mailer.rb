class PromptUserMailer < ApplicationMailer

  def add_record(user, vehicle)
    @user    = user
    @vehicle = vehicle

    mail to: @user.email, subject: prompt_subject(vehicle)
  end

  private

  def prompt_subject(vehicle)
    "Have you done anything to your #{vehicle.name} lately?"
  end
end
