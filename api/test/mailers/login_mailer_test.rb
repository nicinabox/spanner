# frozen_string_literal: true

require 'test_helper'

class LoginMailerTest < ActionMailer::TestCase
  setup do
    new_session
    @user.update!(account_token: 'login-mailer-test-token') if @user.account_token.nil?
  end

  test 'login_link' do
    mail = LoginMailer.login_link(@user, host: 'http://localhost')

    assert_match 'Sign in to Spanner', mail.subject
    assert_equal ['user1@test'], mail.to
    assert_equal [ENV.fetch('FROM_EMAIL', 'noreply@localhost')], mail.from
    assert_match 'Hello', mail.body.encoded
    assert_match 'data:image/png;base64,', mail.body.encoded
  end
end
