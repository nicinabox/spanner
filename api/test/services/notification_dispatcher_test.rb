# frozen_string_literal: true

require 'test_helper'

require 'webmock/minitest'
require 'minitest/mock'

class EmailChannelTest < ActiveSupport::TestCase
  setup do
    @user = User.first
    @reminders = @user.reminders.to_a
    @schedule = ServiceSchedule.new(
      vehicle: @user.vehicles.first,
      classification: Classification.find_by!(key: 'oil_change'),
      distance_interval: 5000,
      next_due_mileage: 55_000,
      next_due_date: 3.months.from_now.to_date
    )
    @schedules = [@schedule]
  end

  test 'available? returns true when POSTMARK_API_KEY set' do
    with_env('POSTMARK_API_KEY' => 'key', 'SMTP_HOST' => nil) do
      assert EmailChannel.available?
    end
  end

  test 'available? returns true when SMTP_HOST set' do
    with_env('POSTMARK_API_KEY' => nil, 'SMTP_HOST' => 'smtp.example.com') do
      assert EmailChannel.available?
    end
  end

  test 'available? returns false when neither set' do
    with_env('POSTMARK_API_KEY' => nil, 'SMTP_HOST' => nil) do
      assert_not EmailChannel.available?
    end
  end

  test 'delivers reminder_today via RemindersMailer' do
    assert_emails 1 do
      EmailChannel.deliver(:reminder_today, user: @user, reminders: @reminders)
    end
  end

  test 'delivers reminder_upcoming via RemindersMailer' do
    assert_emails 1 do
      EmailChannel.deliver(:reminder_upcoming, user: @user, reminders: @reminders)
    end
  end

  test 'delivers schedule_due_today via RemindersMailer' do
    assert_emails 1 do
      EmailChannel.deliver(:schedule_due_today, user: @user, schedules: @schedules)
    end
  end

  test 'delivers schedule_due_upcoming via RemindersMailer' do
    assert_emails 1 do
      EmailChannel.deliver(:schedule_due_upcoming, user: @user, schedules: @schedules)
    end
  end

  private

  def with_env(vars)
    originals = vars.to_h { |k, _| [k.to_s, ENV.fetch(k.to_s, nil)] }
    vars.each { |k, v| v.nil? ? ENV.delete(k.to_s) : ENV[k.to_s] = v }
    yield
  ensure
    originals.each { |k, v| v.nil? ? ENV.delete(k) : ENV[k] = v }
  end
end

class WebhookChannelTest < ActiveSupport::TestCase
  setup do
    @user = User.first
    @reminders = @user.reminders.to_a
    @schedule = ServiceSchedule.new(
      vehicle: @user.vehicles.first,
      classification: Classification.find_by!(key: 'oil_change'),
      distance_interval: 5000,
      next_due_mileage: 55_000,
      next_due_date: 3.months.from_now.to_date
    )
  end

  test 'available? returns true' do
    assert WebhookChannel.available?
  end

  test 'sends reminder payload to webhook URL' do
    @user.preferences.webhook_url = 'https://hooks.example.com'
    @user.save!
    stub_request(:post, 'https://hooks.example.com')

    WebhookChannel.deliver(:reminder_today, user: @user, reminders: @reminders)

    assert_requested(:post, 'https://hooks.example.com') do |req|
      body = JSON.parse(req.body)
      body['event'] == 'reminder_today' &&
        body['user']['email'] == @user.email &&
        body.key?('reminders')
    end
  end

  test 'sends schedule payload with schedules key' do
    @user.preferences.webhook_url = 'https://hooks.example.com'
    @user.save!
    stub_request(:post, 'https://hooks.example.com')

    WebhookChannel.deliver(:schedule_due_today, user: @user, schedules: [@schedule])

    assert_requested(:post, 'https://hooks.example.com') do |req|
      body = JSON.parse(req.body)
      body['event'] == 'schedule_due_today' &&
        body.key?('schedules') &&
        !body.key?('reminders')
    end
  end

  private

  def with_env(vars)
    originals = vars.to_h { |k, _| [k.to_s, ENV.fetch(k.to_s, nil)] }
    vars.each { |k, v| v.nil? ? ENV.delete(k.to_s) : ENV[k.to_s] = v }
    yield
  ensure
    originals.each { |k, v| v.nil? ? ENV.delete(k) : ENV[k] = v }
  end
end

class NotificationDispatcherTest < ActiveSupport::TestCase
  setup do
    @user = User.first
    @reminders = @user.reminders.to_a
  end

  test 'dispatches to email channel when available' do
    EmailChannel.stub(:available?, true) do
      WebhookChannel.stub(:available?, false) do
        assert_emails 1 do
          NotificationDispatcher.dispatch(:reminder_today, user: @user, reminders: @reminders)
        end
      end
    end
  end

  test 'dispatches to webhook channel when available' do
    @user.preferences.webhook_url = 'https://hooks.example.com'
    @user.save!
    stub_request(:post, 'https://hooks.example.com')

    EmailChannel.stub(:available?, false) do
      WebhookChannel.stub(:available?, true) do
        NotificationDispatcher.dispatch(:reminder_today, user: @user, reminders: @reminders)
      end
    end

    assert_requested :post, 'https://hooks.example.com'
  end

  test 'dispatches to both channels when both available' do
    @user.preferences.webhook_url = 'https://hooks.example.com'
    @user.save!
    stub_request(:post, 'https://hooks.example.com')

    EmailChannel.stub(:available?, true) do
      WebhookChannel.stub(:available?, true) do
        assert_emails 1 do
          NotificationDispatcher.dispatch(:reminder_today, user: @user, reminders: @reminders)
        end
      end
    end

    assert_requested :post, 'https://hooks.example.com'
  end

  test 'skips unavailable channels' do
    EmailChannel.stub(:available?, false) do
      WebhookChannel.stub(:available?, false) do
        assert_emails 0 do
          NotificationDispatcher.dispatch(:reminder_today, user: @user, reminders: @reminders)
        end
      end
    end
  end

  test 'continues to next channel if one raises' do
    @user.preferences.webhook_url = 'https://hooks.example.com'
    @user.save!
    stub_request(:post, 'https://hooks.example.com')

    EmailChannel.stub(:available?, true) do
      WebhookChannel.stub(:available?, true) do
        # Stub deliver to raise, then verify webhook still fires
        EmailChannel.stub(:deliver, ->(*, **) { raise 'email down' }) do
          NotificationDispatcher.dispatch(:reminder_today, user: @user, reminders: @reminders)
        end
      end
    end

    assert_requested :post, 'https://hooks.example.com'
  end

  private

  def with_env(vars)
    originals = vars.transform_keys(&:to_s).transform_values { |k| ENV.fetch(k, nil) }
    vars.each { |k, v| v.nil? ? ENV.delete(k.to_s) : ENV[k.to_s] = v }
    yield
  ensure
    originals.each { |k, v| v.nil? ? ENV.delete(k) : ENV[k] = v }
  end
end
