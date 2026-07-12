# frozen_string_literal: true

require 'test_helper'

require 'webmock/minitest'
require 'minitest/mock'

class TestChannel < Channel
  attr_reader :deliveries

  def initialize
    super
    @deliveries = []
    @available = true
  end

  def available?
    @available
  end

  def disable!
    @available = false
  end

  def deliver(event, user:, reminders: nil, schedules: nil)
    @deliveries << { event:, user:, reminders:, schedules: }
  end
end

class EmailChannelTest < ActiveSupport::TestCase
  setup do
    @user = User.first
    @vehicle = @user.vehicles.first
    @oil = Classification.create!(
      name: 'Oil Change',
      vehicle: @vehicle,
      keywords: ['oil change']
    )
    @reminders = @user.reminders.to_a
    @schedule = ServiceSchedule.new(
      vehicle: @vehicle,
      classification: @oil,
      distance_interval: 5000,
      next_due_mileage: 55_000,
      next_due_date: 3.months.from_now.to_date
    )
    @schedules = [@schedule]
  end

  test 'available? returns true when POSTMARK_API_KEY set' do
    with_env('POSTMARK_API_KEY' => 'key', 'SMTP_HOST' => nil) do
      assert EmailChannel.new.can_deliver?(:reminder_today, @user)
    end
  end

  test 'available? returns true when SMTP_HOST set' do
    with_env('POSTMARK_API_KEY' => nil, 'SMTP_HOST' => 'smtp.example.com') do
      assert EmailChannel.new.can_deliver?(:reminder_today, @user)
    end
  end

  test 'available? returns false when neither set' do
    with_env('POSTMARK_API_KEY' => nil, 'SMTP_HOST' => nil) do
      assert_not EmailChannel.new.can_deliver?(:reminder_today, @user)
    end
  end

  test 'delivers reminder_today via RemindersMailer' do
    assert_emails 1 do
      EmailChannel.new.deliver(:reminder_today, user: @user, reminders: @reminders)
    end
  end

  test 'delivers reminder_upcoming via RemindersMailer' do
    assert_emails 1 do
      EmailChannel.new.deliver(:reminder_upcoming, user: @user, reminders: @reminders)
    end
  end

  test 'delivers schedule_due_today via RemindersMailer' do
    assert_emails 1 do
      EmailChannel.new.deliver(:schedule_due_today, user: @user, schedules: @schedules)
    end
  end

  test 'delivers schedule_due_upcoming via RemindersMailer' do
    assert_emails 1 do
      EmailChannel.new.deliver(:schedule_due_upcoming, user: @user, schedules: @schedules)
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
    @vehicle = @user.vehicles.first
    @oil = Classification.create!(
      name: 'Oil Change',
      vehicle: @vehicle,
      keywords: ['oil change']
    )
    @reminders = @user.reminders.to_a
    @schedule = ServiceSchedule.new(
      vehicle: @vehicle,
      classification: @oil,
      distance_interval: 5000,
      next_due_mileage: 55_000,
      next_due_date: 3.months.from_now.to_date
    )
  end

  test 'available? returns true' do
    assert WebhookChannel.new.can_deliver?(:reminder_today, @user)
  end

  test 'sends reminder payload to webhook URL' do
    @user.preferences.webhook_url = 'https://hooks.example.com'
    @user.save!
    stub_request(:post, 'https://hooks.example.com')

    WebhookChannel.new.deliver(:reminder_today, user: @user, reminders: @reminders)

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

    WebhookChannel.new.deliver(:schedule_due_today, user: @user, schedules: [@schedule])

    assert_requested(:post, 'https://hooks.example.com') do |req|
      body = JSON.parse(req.body)
      body['event'] == 'schedule_due_today' &&
        body.key?('schedules') &&
        !body.key?('reminders')
    end
  end
end

class NotificationDispatcherTest < ActiveSupport::TestCase
  setup do
    @user = User.first
    @reminders = @user.reminders.to_a
  end

  test 'dispatches to available channels' do
    channel = TestChannel.new
    dispatcher = NotificationDispatcher.new(channels: [channel])

    dispatcher.dispatch(:reminder_today, user: @user, reminders: @reminders)

    assert_equal 1, channel.deliveries.size
    assert_equal :reminder_today, channel.deliveries.first[:event]
  end

  test 'skips unavailable channels' do
    channel = TestChannel.new
    channel.disable!
    dispatcher = NotificationDispatcher.new(channels: [channel])

    dispatcher.dispatch(:reminder_today, user: @user, reminders: @reminders)

    assert_empty channel.deliveries
  end

  test 'dispatches to all available channels' do
    channel_a = TestChannel.new
    channel_b = TestChannel.new
    dispatcher = NotificationDispatcher.new(channels: [channel_a, channel_b])

    dispatcher.dispatch(:reminder_today, user: @user, reminders: @reminders)

    assert_equal 1, channel_a.deliveries.size
    assert_equal 1, channel_b.deliveries.size
  end

  test 'skips unavailable but delivers to available' do
    channel_a = TestChannel.new
    channel_b = TestChannel.new
    channel_b.disable!
    dispatcher = NotificationDispatcher.new(channels: [channel_a, channel_b])

    dispatcher.dispatch(:reminder_today, user: @user, reminders: @reminders)

    assert_equal 1, channel_a.deliveries.size
    assert_empty channel_b.deliveries
  end

  test 'continues to next channel if one raises' do
    channel_a = TestChannel.new
    # Inject a channel that redefines deliver to raise
    failing = Class.new(Channel) do
      define_method(:available?) { true }
      define_method(:deliver) { |*| raise 'down' }
    end.new
    dispatcher = NotificationDispatcher.new(channels: [failing, channel_a])

    dispatcher.dispatch(:reminder_today, user: @user, reminders: @reminders)

    assert_equal 1, channel_a.deliveries.size
  end

  test 'delivers with user and event context' do
    channel = TestChannel.new
    dispatcher = NotificationDispatcher.new(channels: [channel])

    dispatcher.dispatch(:schedule_due_upcoming, user: @user, schedules: [])

    assert_equal :schedule_due_upcoming, channel.deliveries.first[:event]
    assert_equal @user, channel.deliveries.first[:user]
  end
end
