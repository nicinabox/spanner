# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever

# app_name = 'spanner-api'
# run = "dokku /usr/bin/dokku run #{app_name}"
run = ENV['RUN_JOB_COMMAND'] || "bundle exec"

every :monday, at: '5am' do
  command "#{run} rake qc:weekday_jobs"
end

every :saturday, at: '5am' do
  command "#{run} rake qc:weekend_jobs"
end

every :day, at: '5am' do
  command "#{run} rake qc:daily_jobs"
end

every :hour do
  command "#{run} rake qc:hourly_jobs"
end
