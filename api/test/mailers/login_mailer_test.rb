# frozen_string_literal: true

require 'test_helper'

class LoginMailerTest < ActionMailer::TestCase
  setup do
    new_session
  end

  test 'login_link' do
    mail = LoginMailer.login_link(@user)

    assert_match 'Sign in to Spanner', mail.subject
    assert_equal ['user1@test'], mail.to
    assert_equal [ENV.fetch('FROM_EMAIL', 'noreply@localhost')], mail.from
    assert_match 'Hello', mail.html_part.body.to_s
    assert_match 'data:image/png;base64,', mail.html_part.body.to_s
  end
end
