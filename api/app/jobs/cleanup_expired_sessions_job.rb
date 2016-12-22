class CleanupExpiredSessionsJob < ApplicationJob
  queue_as :default

  def perform
    Session.where(last_seen: nil).destroy_all

    self.class.set(wait: 24.hours).perform_later
  end
end
