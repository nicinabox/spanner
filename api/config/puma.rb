# frozen_string_literal: true

require "puma/plugin/solid_queue"

# Puma can serve each request in a thread from an internal thread pool.
# The `threads` method setting takes two numbers a minimum and maximum.
# Any libraries that use thread pools should be configured to match
# the maximum value specified for Puma. Default is set to 5 threads for minimum
# and maximum, this matches the default thread size of Active Record.
#
threads_count = ENV.fetch('RAILS_MAX_THREADS', 5).to_i
threads threads_count, threads_count

# Specifies the `port` that Puma will listen on to receive requests, default is 3000.
#
port        ENV.fetch('PORT', 3001)

# Specifies the `environment` that Puma will run in.
#
environment ENV.fetch('RAILS_ENV', 'development')

# Run Solid Queue supervisor in-process via Puma plugin. Set to :fork
# to run Solid Queue in a separate forked process instead. The plugin
# monitors both processes and tears them down together.
solid_queue_mode :async

# Allow puma to be restarted by `rails restart` command.
plugin :tmp_restart