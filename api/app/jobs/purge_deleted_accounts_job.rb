# frozen_string_literal: true

class PurgeDeletedAccountsJob < ApplicationJob
  queue_as :low_priority

  PURGE_CUTOFF = 30.days

  def perform
    User.deleted.where(deleted_at: ...PURGE_CUTOFF.ago).find_each do |user|
      user.sessions.delete_all
      user.vehicles.find_each do |vehicle|
        vehicle.records.delete_all
        vehicle.reminders.delete_all
        vehicle.service_schedules.delete_all
      end
      user.vehicles.delete_all
      user.delete
    end
  end
end
