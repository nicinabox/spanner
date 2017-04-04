class DeleteExpiredSessionsJob < ApplicationJob
  queue_as :default

  def perform
    Session.expired.delete_all
  end
end
