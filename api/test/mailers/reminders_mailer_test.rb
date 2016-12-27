require 'test_helper'

class RemindersMailerTest < ActionMailer::TestCase
  setup do
    new_session

    @reminders = @user.reminders
  end

  test "reminder" do
    mail = RemindersMailer.reminder(@user, @reminders)

    assert_equal "Reminders for Mazda", mail.subject
    assert_equal ["user1@test"], mail.to
    assert_equal ["spanner@nicinabox.com"], mail.from
    assert_match "Hello", mail.body.encoded
  end

end
