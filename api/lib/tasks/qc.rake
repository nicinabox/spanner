namespace :qc do
  desc "Run weekday jobs"
  task weekday_jobs: :environment do
  end

  desc "Run weekend jobs"
  task weekend_jobs: :environment do
    WeekendJob.perform_later
  end

  desc "Run daily jobs"
  task daily_jobs: :environment do
    DailyJob.perform_later
    PromptUserJob.perform_later
  end

  desc "Run hourly"
  task hourly_jobs: :environment do
    HourlyJob.perform_later
  end
end
