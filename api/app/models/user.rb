# frozen_string_literal: true

class User < ApplicationRecord
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

  def last_seen
    sessions.order(:last_seen).last.last_seen
  end
end
