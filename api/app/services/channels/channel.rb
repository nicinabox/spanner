# frozen_string_literal: true

class Channel
  def can_deliver?(event, user)
    available? && event_enabled?(event, user)
  end

  def deliver(event, user:, reminders: nil, schedules: nil)
    raise NotImplementedError
  end

  private

  def available?
    raise NotImplementedError
  end

  def event_enabled?(_event, _user)
    true
  end
end
