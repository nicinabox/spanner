class CleanupUnusedSessionsJob < ApplicationJob
  queue_as :default

  def perform()
    Session.where(last_seen: nil).destroy_all
  end
end
