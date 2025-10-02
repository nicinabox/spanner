# frozen_string_literal: true

namespace :qc do
  desc 'Clear all jobs from queue'
  task clear: :environment do
    QC::Worker.new.queues.each do |queue|
      count = queue.count
      queue.delete_all
      puts "Cleared #{count} from #{queue.name} queue"
    end
  end

  desc "Returns the number of jobs in the (default or QUEUE) queue"
  task :count => :environment do
    QC::Worker.new.queues.each do |queue|
      puts "#{queue.name} ->\t #{queue.count}"
    end
  end

  desc 'Run weekday jobs'
  task weekday_jobs: :environment do
    WeekdayJob.perform_later
  end

  desc 'Run weekend jobs'
  task weekend_jobs: :environment do
    WeekendJob.perform_later
  end

  desc 'Run daily jobs'
  task daily_jobs: :environment do
    DailyJob.perform_later
  end

  desc 'Run hourly'
  task hourly_jobs: :environment do
    HourlyJob.perform_later
  end
end
