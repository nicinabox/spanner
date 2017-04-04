class User < ApplicationRecord
  validates_presence_of :email

  has_many :sessions, dependent: :destroy
  has_many :vehicles, dependent: :destroy
  has_many :reminders, through: :vehicles

  before_save { |user| user.email = user.email.strip.downcase }

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
    email == 'demo@spanner'
  end

  def can_access_analytics?
    ['nic@nicinabox.com'].include? email
  end
end
