# frozen_string_literal: true

class CleanupUnverifiedAccountsJob < ApplicationJob
  queue_as :low_priority

  # Users who entered their email but never clicked the magic link
  NEVER_LOGGED_IN_CUTOFF = 30.days
  # Users who logged in once but abandoned the app with no vehicles
  INACTIVE_CUTOFF = 1.year

  def perform
    delete_never_logged_in
    delete_bounced_accounts
    delete_inactive_accounts
  end

  private

  def delete_never_logged_in
    User.where.missing(:sessions, :vehicles)
        .where(users: { created_at: ...NEVER_LOGGED_IN_CUTOFF.ago })
        .where.not(admin: true)
        .destroy_all
  end

  def delete_bounced_accounts
    User.where.missing(:sessions, :vehicles)
        .where.not(email_bounced_at: nil)
        .where.not(admin: true)
        .destroy_all
  end

  def delete_inactive_accounts
    inactive_ids = User.where.missing(:vehicles)
                       .where.not(admin: true)
                       .joins(:sessions)
                       .where(sessions: { last_seen: ...INACTIVE_CUTOFF.ago })
                       .pluck(:id)
                       .uniq

    User.where(id: inactive_ids).destroy_all
  end
end
