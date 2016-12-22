namespace :qc do
  desc "Start recurring jobs"
  task jobs: :environment do
    CleanupExpiredSessionsJob.perform_later
    SendRemindersJob.perform_later
  end

end
