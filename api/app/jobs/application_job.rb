# frozen_string_literal: true

class ApplicationJob < ActiveJob::Base
  queue_as :default

  before_perform do |job|
    Rails.logger.info(
      "[bg] Starting #{job.class.name} (job_id=#{job.job_id}) at #{Time.now.utc.iso8601}"
    )
  end

  after_perform do |job|
    Rails.logger.info(
      "[bg] Finished #{job.class.name} (job_id=#{job.job_id}) at #{Time.now.utc.iso8601}"
    )
  end

  rescue_from(StandardError) do |exception|
    Sentry.capture_exception(exception, extra: { active_job: self.class.name, job_id: arguments.first })
    raise
  end
end
