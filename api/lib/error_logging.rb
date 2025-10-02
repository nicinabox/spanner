module ErrorLogging
  def log_exception(exception, level: :error)
    cleaned = Rails.backtrace_cleaner.clean(exception.backtrace || [])
    message = "\n\n#{exception.class} (#{exception.message}):\n    " +
               cleaned.join("\n    ") +
                   "\n\n"
    logger.send(level, message)
  end
end
