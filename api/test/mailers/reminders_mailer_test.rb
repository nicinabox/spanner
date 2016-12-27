require 'test_helper'

class RemindersMailerTest < ActionMailer::TestCase
  setup do
    new_session

    @reminders = @user.reminders
  end

  test "reminder_today" do
    mail = RemindersMailer.reminder_today(@user, @reminders)

    assert_equal "Reminders for Mazda", mail.subject
    assert_equal ["user1@test"], mail.to
    assert_equal ["spanner@nicinabox.com"], mail.from
    assert_match "Hello", mail.body.encoded
  end

  test "reminder_upcoming" do
    user = User.find 2
    reminders = user.reminders

    mail = RemindersMailer.reminder_upcoming(user, reminders)

    assert_equal "Reminders for Honda", mail.subject
    assert_equal ["user2@test"], mail.to
    assert_equal ["spanner@nicinabox.com"], mail.from
    assert_match "14 days", mail.body.encoded
  end

end
