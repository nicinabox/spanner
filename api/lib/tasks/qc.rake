namespace :qc do
  desc "Start recurring jobs"
  task jobs: :environment do
    CleanupExpiredSessionsJob.perform_later
  end

end
