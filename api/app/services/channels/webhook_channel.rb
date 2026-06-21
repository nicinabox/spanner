# frozen_string_literal: true

require 'net/http'

class WebhookChannel
  TIMEOUT = 5

  def self.available?
    ENV['NOTIFICATION_WEBHOOK_URL'].present?
  end

  def self.deliver(event, user:, reminders: nil, schedules: nil)
    uri = URI(ENV.fetch('NOTIFICATION_WEBHOOK_URL', nil))

    payload = base_payload(event, user)

    if schedules
      payload[:schedules] = schedules.map { |s| schedule_payload(s) }
    else
      payload[:reminders] = Array(reminders).map { |r| reminder_payload(r) }
    end

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = (uri.scheme == 'https')
    http.open_timeout = TIMEOUT
    http.read_timeout = TIMEOUT

    request = Net::HTTP::Post.new(uri.path.presence || '/', 'Content-Type' => 'application/json')
    request.body = payload.to_json

    http.request(request)
  end

  def self.base_payload(event, user)
    {
      event: event,
      timestamp: Time.zone.now.iso8601,
      user: { email: user.email }
    }
  end
  private_class_method :base_payload

  def self.reminder_payload(reminder)
    {
      notes: reminder.notes,
      vehicle: reminder.vehicle.name,
      reminder_date: reminder.reminder_date,
      mileage: reminder.mileage
    }
  end
  private_class_method :reminder_payload

  def self.schedule_payload(schedule)
    {
      classification: schedule.classification.name,
      vehicle: schedule.vehicle.name,
      next_due_date: schedule.next_due_date,
      next_due_mileage: schedule.next_due_mileage,
      notes: schedule.notes
    }
  end
  private_class_method :schedule_payload
end
