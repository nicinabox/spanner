class SendRemindersJob < ApplicationJob
  queue_as :default

  def perform
    reminders = Reminder.where('date BETWEEN ? AND ?', DateTime.now.beginning_of_day, DateTime.now.end_of_day)
    users = reminders.group_by { |r| r.vehicle.user }

    users.each do |user, reminders|
      RemindersMailer.reminder(user, reminders).deliver_later
    end
  end
end
