# frozen_string_literal: true

# JobScheduler is responsible for scheduling recurring jobs using QueueClassic
# It provides a simple interface to enqueue jobs that will run at specified intervals
class JobScheduler
  class << self
    def schedule_jobs
      puts "Scheduling jobs..."
      schedule_weekday_jobs
      schedule_weekend_jobs
      schedule_daily_jobs
      schedule_hourly_jobs
    end

    private

    def schedule_weekday_jobs
      return unless monday?
      return unless time_to_run?(5) # 5 AM

      puts "Scheduling weekday job"
      WeekdayJob.perform_later
    end

    def schedule_weekend_jobs
      return unless saturday?
      return unless time_to_run?(5) # 5 AM

      puts "Scheduling weekend job"
      WeekendJob.perform_later
    end

    def schedule_daily_jobs
      return unless time_to_run?(5) # 5 AM

      puts "Scheduling daily job"
      DailyJob.perform_later
    end

    def schedule_hourly_jobs
      return unless time_to_run?(current_hour)

      puts "Scheduling hourly job"
      HourlyJob.perform_later
    end

    def monday?
      Time.current.wday == 1
    end

    def saturday?
      Time.current.wday == 6
    end

    def time_to_run?(hour)
      current_hour == hour
    end

    def current_hour
      Time.current.hour
    end
  end
end
