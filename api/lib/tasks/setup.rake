# frozen_string_literal: true

require 'tty-prompt'
require_relative '../env_file'

desc 'Interactive setup for self-hosted Spanner'
task setup: :environment do
  prompt = TTY::Prompt.new

  # Guard: check if admin already exists
  if User.exists?(admin: true)
    prompt.say('Already configured. Admin user exists.')
    exit(0)
  end

  env_path = ENV.fetch('ENV_FILE', Rails.root.join('../../.env').to_s)
  env_file = File.exist?(env_path) ? EnvFile.read(path: env_path) : EnvFile.new

  # Generate secrets if missing
  secrets = {
    'DB_PASSWORD' => -> { SecureRandom.hex(32) },
    'SECRET_KEY_BASE' => -> { SecureRandom.hex(64) },
    'CLIENT_SECRET' => -> { SecureRandom.urlsafe_base64(32) }
  }

  secrets.each do |key, generator|
    env_file.assign_unless_present(key) { generator.call }
  end

  # Public URL
  web_url = prompt.ask('Public URL for email links:', default: 'http://localhost:3000')
  env_file.set('WEB_URL', web_url)
  env_file.set('API_URL', 'http://api:3001')

  # Admin account
  email = prompt.ask('Admin email:') { |q| q.validate(:email) }
  password = prompt.mask('Admin password:') do |q|
    q.validate(/\A.{8,}\z/, 'Password must be at least 8 characters')
  end
  password_confirm = prompt.mask('Confirm password:')
  unless password == password_confirm
    prompt.error('Passwords do not match')
    exit(1)
  end

  User.create!(email: email, password: password, admin: true)
  prompt.ok('Admin user created.')

  # Email configuration
  if prompt.yes?('Configure email?')
    env_file.set('SMTP_HOST', prompt.ask('SMTP host:'))
    env_file.set('SMTP_PORT', prompt.ask('SMTP port:', default: '587'))
    env_file.set('SMTP_USERNAME', prompt.ask('SMTP username:'))
    env_file.set('SMTP_PASSWORD', prompt.mask('SMTP password:'))
    env_file.set('FROM_EMAIL', prompt.ask('From email:', default: 'noreply@localhost'))
  end

  # Webhook configuration
  env_file.set('NOTIFICATION_WEBHOOK_URL', prompt.ask('Webhook URL:')) if prompt.yes?('Configure webhook?')

  # Write .env
  env_file.save(path: env_path)
  prompt.ok("Configuration written to #{env_path}")

  prompt.say("Setup complete. Sign in at #{web_url}")
end
