# frozen_string_literal: true

class User < ApplicationRecord
  REMINDER_CUTOFF_DAYS = 365

  # How long to wait before sending another reminder once a user enters
  # each inactivity tier.
  REMINDER_BACKOFF_TIERS = [
    { after: 0.days,   interval: 0.days },
    { after: 30.days,  interval: 7.days },
    { after: 90.days,  interval: 14.days },
    { after: 180.days, interval: 30.days }
  ].freeze

  # Inactive users are still sent the first reminder after the cutoff, then
  # they are suppressed forever. This lets the cutoff act as a final grace
  # reminder before unsubscribing from future noise.

  validates :email, presence: true

  store_accessor :preferences

  has_many :sessions, dependent: :destroy
  has_many :vehicles, dependent: :destroy
  has_many :reminders, through: :vehicles
  has_many :records, through: :vehicles

  before_save { |user| user.email = user.email.strip.downcase }

  def preferences
    @preferences ||= UserPreferences.new(self[:preferences] || {})
  end

  def preferences=(value)
    # Accepts either a UserPreferences object or a hash
    prefs_hash = value.is_a?(UserPreferences) ? value.to_hash : value
    self[:preferences] = prefs_hash
    @preferences = UserPreferences.new(prefs_hash)
  end

  def self.expired_sessions
    includes(:sessions).where(sessions: { user_id: nil })
  end

  def time_zone
    ActiveSupport::TimeZone[(time_zone_offset || 0).to_f]
  end

  def user_id
    id
  end

  def demo_account?
    email == ENV['DEMO_USER']
  end

  def can_access_analytics?
    [ENV['ANALYTICS_USER']].include? email
  end

  def active_sessions?
    sessions.active.any?
  end

  def last_seen_at
    sessions.maximum(:last_seen)
  end

  def days_since_last_seen
    return nil unless last_seen_at

    ((Time.zone.now - last_seen_at) / 1.day).to_i
  end

  def reminder_backoff_interval
    return 0.days unless days_since_last_seen

    REMINDER_BACKOFF_TIERS.reverse.find do |tier|
      days_since_last_seen >= tier[:after].parts.fetch(:days, 0)
    end.fetch(:interval)
  end

  def reminder_eligible?
    return false if days_since_last_seen.nil? && created_at.before?(REMINDER_CUTOFF_DAYS.days.ago)
    return false if days_since_last_seen && days_since_last_seen > REMINDER_CUTOFF_DAYS
    return true if last_reminder_sent_at.nil?

    (Time.zone.now - last_reminder_sent_at) >= reminder_backoff_interval
  end

  def record_reminder_sent!
    update!(last_reminder_sent_at: Time.zone.now)
  end

  # Kept for backward compatibility; prefer last_seen_at.
  def last_seen
    sessions.order(:last_seen).last&.last_seen
  end
end
