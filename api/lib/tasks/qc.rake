namespace :qc do
  desc "Start recurring jobs"
  task jobs: :environment do
    CleanupUnusedSessionsJob.perform_later
    SendRemindersJob.perform_later
  end

end
