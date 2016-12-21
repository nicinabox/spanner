require 'test_helper'

class LoginMailerTest < ActionMailer::TestCase
  setup do
    new_session
  end

  test "login_link" do
    mail = LoginMailer.login_link(@user)

    assert_equal "Sign in to Spanner", mail.subject
    assert_equal ["user1@test"], mail.to
    assert_equal ["spanner@nicinabox.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end

end
