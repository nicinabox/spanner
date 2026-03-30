# frozen_string_literal: true

class WeekdayJob < ApplicationJob
  queue_as :low_priority

  def perform
    # Add your weekday-specific tasks here
    # This job is scheduled to run on Mondays at 5 AM
  end
end
