# frozen_string_literal: true

require 'test_helper'

class RecordTagsControllerTest < ActionDispatch::IntegrationTest
  setup do
    new_session
    @vehicle = @user.vehicles.first
    @record = @vehicle.records.create!(date: Time.zone.today, notes: 'Test record')
    @tag = Classification.create!(
      name: 'Custom Tag',
      vehicle: @vehicle,
      keywords: [],
      system: false
    )
  end

  test 'add tag to record' do
    post vehicle_record_record_tags_url(@vehicle, @record),
         params: { classification_id: @tag.id },
         headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    assert @record.reload.classifications.include?(@tag)
  end

  test 'add tag returns error for other vehicles record' do
    other = users(:two)
    other_vehicle = other.vehicles.first
    other_record = other_vehicle.records.create!(date: Time.zone.today, notes: 'Test')
    post vehicle_record_record_tags_url(other_vehicle, other_record),
         params: { classification_id: @tag.id },
         headers: http_options(@session.auth_token)[:headers]
    assert_response :not_found
  end

  test 'remove tag from record' do
    @record.record_classifications.create!(classification: @tag, classifier: 'manual', confidence: 1.0, auto_tagged: false)
    delete vehicle_record_record_tag_url(@vehicle, @record, @tag),
           headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    assert_not @record.reload.classifications.include?(@tag)
  end
end