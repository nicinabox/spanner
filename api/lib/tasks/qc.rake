namespace :qc do
  desc "Run daily jobs"
  task daily_jobs: :environment do
    DailyRemindersJob.perform_later
    DeleteExpiredSessionsJob.perform_later
    PromptUserJob.perform_later
  end

  desc "Run hourly"
  task hourly_jobs: :environment do
    HourlyRemindersJob.perform_later
  end
end
