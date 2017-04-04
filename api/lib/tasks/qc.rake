namespace :qc do
  desc "Start recurring jobs"
  task jobs: :environment do
    SendRemindersJob.perform_later
    DeleteExpiredSessionsJob.perform_later
  end

end
