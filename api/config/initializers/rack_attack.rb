# frozen_string_literal: true

class Rack::Attack
  # Use a dedicated memory store so throttling works in all environments
  # (Rails.cache defaults to null_store in test env)
  cache.store = ActiveSupport::Cache::MemoryStore.new

  # Throttle POST /login: 10 requests per minute per IP
  throttle('logins/ip', limit: 10, period: 60.seconds) do |req|
    req.ip if req.path == '/login' && req.post?
  end

  # Throttle POST /password/reset: 5 requests per minute per IP
  throttle('password_resets/ip', limit: 5, period: 60.seconds) do |req|
    req.ip if req.path == '/password/reset' && req.post?
  end

  # Throttle GET /login/:token: 10 requests per minute per IP
  throttle('login_tokens/ip', limit: 10, period: 60.seconds) do |req|
    req.ip if req.path =~ %r{^/login/} && req.get?
  end

  # Throttle POST /sessions (deprecated): 10 per minute per IP
  throttle('sessions/ip', limit: 10, period: 60.seconds) do |req|
    req.ip if req.path == '/sessions' && req.post?
  end

  # Throttled response: 429 Too Many Requests
  self.throttled_responder = lambda do |request|
    headers = {
      'Content-Type' => 'application/json',
      'Retry-After' => '60'
    }
    body = JSON.generate({ error: { title: 'Rate limit exceeded. Try again in a minute.' } })
    [429, headers, [body]]
  end
end