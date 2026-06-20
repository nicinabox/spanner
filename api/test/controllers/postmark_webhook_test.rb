# frozen_string_literal: true

require 'test_helper'

class PostmarkWebhookTest < ActionDispatch::IntegrationTest
  test 'hard bounce disables reminders for user' do
    user = User.first
    assert user.reminder_eligible?

    post '/webhooks/postmark',
         params: { Type: 'HardBounce', Email: user.email, BouncedAt: Time.zone.now }.to_json,
         headers: { 'Content-Type' => 'application/json' }

    assert_response :ok
    user.reload
    assert user.email_bounced_at.present?
    assert_not user.reminder_eligible?
  end

  test 'spam complaint disables reminders for user' do
    user = User.first

    post '/webhooks/postmark',
         params: { Type: 'SpamComplaint', Email: user.email, BouncedAt: Time.zone.now }.to_json,
         headers: { 'Content-Type' => 'application/json' }

    assert_response :ok
    user.reload
    assert user.email_bounced_at.present?
    assert_not user.reminder_eligible?
  end

  test 'soft bounce does not disable reminders' do
    user = User.first

    post '/webhooks/postmark',
         params: { Type: 'SoftBounce', Email: user.email, BouncedAt: Time.zone.now }.to_json,
         headers: { 'Content-Type' => 'application/json' }

    assert_response :ok
    user.reload
    assert user.email_bounced_at.nil?
    assert user.reminder_eligible?
  end

  test 'unknown event type is accepted and ignored' do
    user = User.first

    post '/webhooks/postmark',
         params: { Recipient: user.email, MessageID: '123' }.to_json,
         headers: { 'Content-Type' => 'application/json' }

    assert_response :ok
    user.reload
    assert user.email_bounced_at.nil?
  end

  test 'webhook with unknown email is accepted' do
    post '/webhooks/postmark',
         params: { Type: 'HardBounce', Email: 'nonexistent@test' }.to_json,
         headers: { 'Content-Type' => 'application/json' }

    assert_response :ok
  end

  test 'confirming email change clears bounce flag' do
    user = User.first
    user.update!(email_bounced_at: Time.zone.now)
    assert_not user.reminder_eligible?

    user.update!(
      unconfirmed_email: 'newemail@test',
      email_confirmation_token: 'token123',
      email_confirmation_token_valid_until: 1.hour.from_now
    )

    User.confirm_email_change!('token123')

    user.reload
    assert user.email_bounced_at.nil?
    assert user.reminder_eligible?
  end
end
