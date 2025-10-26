namespace :scheduler do
  desc 'Process scheduled jobs once'
  task once: :environment do
    JobScheduler.schedule_jobs
  end

  desc 'Process scheduled jobs'
  task run: :environment do
    loop do
      JobScheduler.schedule_jobs
      sleep 60 # Check every minute
    end
  end

  namespace :jobs do
    desc 'Run weekday jobs (Monday 5am)'
    task weekday: :environment do
      Rake::Task['qc:weekday_jobs'].invoke
    end

    desc 'Run weekend jobs (Saturday 5am)'
    task weekend: :environment do
      Rake::Task['qc:weekend_jobs'].invoke
    end

    desc 'Run daily jobs (5am)'
    task daily: :environment do
      Rake::Task['qc:daily_jobs'].invoke
    end

    desc 'Run hourly jobs'
    task hourly: :environment do
      Rake::Task['qc:hourly_jobs'].invoke
    end
  end
end
