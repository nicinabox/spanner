# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password validations: false

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

  EMAIL_CONFIRMATION_TOKEN_TTL = 15.minutes

  validates :email, presence: true
  validates :unconfirmed_email,
            allow_nil: true,
            format: { with: URI::MailTo::EMAIL_REGEXP, message: 'is invalid' }

  store_accessor :preferences

  scope :deleted, -> { where.not(deleted_at: nil) }

  def destroy
    return if deleted_at?

    update!(deleted_at: Time.current)
    sessions.destroy_all
  end

  def restore!
    update!(deleted_at: nil)
  end

  def generate_account_token!
    update!(account_token: SecureRandom.urlsafe_base64(16))
  end

  def deleted?
    deleted_at?
  end

  has_many :sessions, dependent: :destroy
  has_many :vehicles, dependent: :destroy
  has_many :reminders, through: :vehicles
  has_many :records, through: :vehicles
  has_many :vehicle_shares, dependent: :destroy
  has_many :shared_vehicles, through: :vehicle_shares, source: :vehicle

  def accessible_vehicles
    Vehicle.where(id: vehicles.select(:id))
           .or(Vehicle.where(id: vehicle_shares.accepted.select(:vehicle_id)))
  end

  before_save { |user| user.email = user.email.strip.downcase if user.email }
  before_save { |user| user.unconfirmed_email = user.unconfirmed_email.strip.downcase if user.unconfirmed_email }
  before_create { |user| user.account_token ||= SecureRandom.urlsafe_base64(16) }

  # Begins an email change request. Stores the requested (new) email and a
  # single-use confirmation token, but does NOT modify the current `email`.
  # Raises ActiveRecord::RecordInvalid if the new email is already taken or
  # otherwise invalid.
  def request_email_change!(new_email)
    new_email = new_email.to_s.strip.downcase
    raise ActiveRecord::RecordInvalid, self if new_email.blank?
    raise ActiveRecord::RecordInvalid, self if new_email == email

    if self.class.exists?(email: new_email)
      errors.add(:email, 'has already been taken')
      raise ActiveRecord::RecordInvalid, self
    end

    update!(
      unconfirmed_email: new_email,
      email_confirmation_token: SecureRandom.urlsafe_base64,
      email_confirmation_token_valid_until: EMAIL_CONFIRMATION_TOKEN_TTL.from_now
    )
  end

  # Redeems a pending email change for the given token, committing the new
  # email. Returns the user on success, nil if the token is invalid/expired.
  # Re-validates uniqueness at commit time to guard against races.
  def self.confirm_email_change!(token)
    return nil if token.blank?

    user = where(email_confirmation_token: token)
           .where('email_confirmation_token_valid_until > ?', Time.zone.now)
           .first
    return nil unless user&.unconfirmed_email

    if exists?(email: user.unconfirmed_email)
      user.errors.add(:email, 'has already been taken')
      return nil
    end

    user.update!(
      email: user.unconfirmed_email,
      unconfirmed_email: nil,
      email_confirmation_token: nil,
      email_confirmation_token_valid_until: nil,
      email_bounced_at: nil
    )
    user
  end

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

  def admin?
    admin
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
    return false if unsubscribed_at? || email_bounced_at.present?
    return false if inactive?

    last_reminder_sent_at.nil? || (Time.zone.now - last_reminder_sent_at) >= reminder_backoff_interval
  end

  def inactive?
    return true if days_since_last_seen.nil? && created_at.before?(REMINDER_CUTOFF_DAYS.days.ago)

    days_since_last_seen && days_since_last_seen > REMINDER_CUTOFF_DAYS
  end

  def record_reminder_sent!
    update!(last_reminder_sent_at: Time.zone.now)
  end

  # Kept for backward compatibility; prefer last_seen_at.
  def last_seen
    sessions.order(:last_seen).last&.last_seen
  end

  def password_enabled?
    password_digest.present?
  end

  validate :password_length_if_set

  private

  def password_length_if_set
    return unless password_digest_changed?
    return if password_digest.nil?
    return if password && password.length >= 8

    errors.add(:password, 'is too short (minimum is 8 characters)')
  end
end
