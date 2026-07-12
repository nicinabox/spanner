# frozen_string_literal: true

require 'net/http'

class WebhookChannel < Channel
  TIMEOUT = 5

  private

  def available?
    true
  end

  public

  def deliver(event, user:, reminders: nil, schedules: nil)
    webhook_url = user.preferences.webhook_url.presence
    return unless webhook_url

    uri = URI(webhook_url)
    payload = build_payload(event, user, reminders:, schedules:)
    request = Net::HTTP::Post.new(uri.path.presence || '/', 'Content-Type' => 'application/json')
    request.body = payload.to_json

    apply_ntfy_format(request, event, reminders:, schedules:) if webhook_url.include?('ntfy.sh')

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = (uri.scheme == 'https')
    http.open_timeout = TIMEOUT
    http.read_timeout = TIMEOUT

    http.request(request)
  end

  private

  def build_payload(event, user, reminders: nil, schedules: nil)
    payload = base_payload(event, user)

    if schedules
      payload[:schedules] = schedules.map { |s| schedule_payload(s) }
    else
      payload[:reminders] = Array(reminders).map { |r| reminder_payload(r) }
    end

    payload
  end

  def apply_ntfy_format(request, event, reminders: nil, schedules: nil)
    priority = event.to_s.start_with?('schedule') ? '4' : '3'
    title, message = ntfy_title_and_message(reminders:, schedules:)

    request.body = message
    request['Title'] = "Spanner - #{title}"
    request['Priority'] = priority
    request['Tags'] = 'wrench'
    request['Actions'] = "view, View Vehicles, #{Rails.application.config.x.web_url}/vehicles"
  end

  def ntfy_title_and_message(reminders: nil, schedules: nil)
    if schedules
      ntfy_schedules_content(schedules)
    else
      ntfy_reminders_content(Array(reminders))
    end
  end

  def ntfy_schedules_content(schedules)
    names = schedules.map { |s| s.vehicle.name }.uniq
    title = "Schedules due for #{names.to_sentence}"
    message = schedules.map { |s| "#{s.vehicle.name}: #{s.classification.name}" }.join("\n")
    [title, message]
  end

  def ntfy_reminders_content(reminders)
    names = reminders.map { |r| r.vehicle.name }.uniq
    title = "Reminders for #{names.to_sentence}"
    message = reminders.group_by(&:vehicle).map do |vehicle, veh_reminders|
      "#{vehicle.name}\n#{veh_reminders.map { |r| "  \u2022 #{r.notes}" }.join("\n")}"
    end.join("\n\n")
    [title, message]
  end

  def vehicle_link(vehicle)
    "[#{vehicle.name}](#{Rails.application.config.x.web_url}/vehicles/#{vehicle.id})"
  end

  def base_payload(event, user)
    {
      event: event,
      timestamp: Time.zone.now.iso8601,
      user: { email: user.email }
    }
  end

  def reminder_payload(reminder)
    {
      notes: reminder.notes,
      vehicle: reminder.vehicle.name,
      reminder_date: reminder.reminder_date,
      mileage: reminder.mileage
    }
  end

  def schedule_payload(schedule)
    {
      classification: schedule.classification.name,
      vehicle: schedule.vehicle.name,
      next_due_date: schedule.next_due_date,
      next_due_mileage: schedule.next_due_mileage,
      notes: schedule.notes
    }
  end
end
