# frozen_string_literal: true

module SessionCreation
  extend ActiveSupport::Concern

  private

  def create_session!(user)
    browser = Browser.new(request.user_agent)
    name = request.user_agent =~ /Spanner/ ? 'Spanner iOS' : browser.name

    user.update!(
      login_token: nil,
      login_token_valid_until: 1.year.ago
    )

    session = user.sessions.build(
      ip: remote_ip,
      description: name || browser.name,
      user_agent: request.user_agent,
      last_seen: Time.zone.now,
      auth_token: SecureRandom.urlsafe_base64(24),
      auth_token_valid_until: 2.months.from_now
    )
    session.save
    session.user.update!(time_zone_offset: time_zone_offset)
    session
  end
end
