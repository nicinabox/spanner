# frozen_string_literal: true

return unless Rails.env.production?

Rails.application.config.after_initialize do
  next if @bg_started

  @bg_started = true
  Rails.logger.info('[bg] Booting Solid Queue supervisor (in-process)')

  begin
    SolidQueue.supervisor = SolidQueue::Supervisor.start(mode: :async, standalone: false)
    Rails.logger.info('[bg] Solid Queue supervisor started')
  rescue StandardError => e
    Rails.logger.error("[bg] Solid Queue supervisor failed to start: #{e.message}")
    Sentry.capture_exception(e) if defined?(Sentry)
    raise
  end

  shutdown = proc do
    next if @bg_shutting_down

    @bg_shutting_down = true
    Rails.logger.info('[bg] Draining Solid Queue supervisor')
    SolidQueue.supervisor&.stop
    Rails.logger.info('[bg] Shutdown complete')
  end

  Signal.trap('TERM') { shutdown.call }
  Signal.trap('INT')  { shutdown.call }
end