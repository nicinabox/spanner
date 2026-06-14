require 'test_helper'

class PromptUserMailerTest < ActionMailer::TestCase
  setup do
    new_session
    @vehicle = @user.vehicles.first
  end

  test "add_record includes prompt control links" do
    mail = PromptUserMailer.add_record(@user, @vehicle)

    assert_equal "Have you done anything to your #{@vehicle.name} lately?", mail.subject
    assert_equal [@user.email], mail.to
    assert_equal ['spanner@nicinabox.com'], mail.from

    body = mail.body.encoded
    assert_match 'Remind Me Later', body
    assert_match 'Mute', body
    assert_match '/prompt_controls/', body
    assert_match '/unsubscribe/', body
  end
end
