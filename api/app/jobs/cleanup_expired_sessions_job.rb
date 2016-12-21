class CleanupExpiredSessionsJob < ApplicationJob
  queue_as :default

  def perform
    sessions = Session.where(last_seen: nil)
    puts "Need to clean #{sessions.size}"

    self.class.set(wait: 1.minute).perform_later
  end
end
