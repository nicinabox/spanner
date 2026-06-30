# frozen_string_literal: true

require 'test_helper'

class PasswordMailerTest < ActionMailer::TestCase
  test 'reset link email' do
    user = users(:one)
    user.update!(password_reset_token: 'reset-token-abc',
                 password_reset_token_valid_until: 15.minutes.from_now)

    email = PasswordMailer.reset_link(user)

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal [user.email], email.to
    assert_equal 'Reset your Spanner password', email.subject
    assert_includes email.body.encoded, 'reset-token-abc'
  end
end
