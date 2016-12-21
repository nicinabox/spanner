namespace :qc do
  desc "Start recurring jobs"
  task recurring: :environment do
    CleanupExpiredSessionsJob.perform_later
  end

end
