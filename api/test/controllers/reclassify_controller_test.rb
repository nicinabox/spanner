# frozen_string_literal: true

require 'test_helper'

class ReclassifyControllerTest < ActionDispatch::IntegrationTest
  setup do
    new_session
    @vehicle = @user.vehicles.first
    @record = @vehicle.records.create!(date: Time.zone.today, notes: 'oil change and filter')
    @tag = Classification.create!(
      name: 'Oil Change',
      vehicle: @vehicle,
      keywords: ['oil change'],
      system: false
    )
  end

  test 'reclassify runs classifier on all records' do
    post "/vehicles/#{@vehicle.id}/reclassify",
         headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    assert @record.reload.classifications.include?(@tag)
  end

  test 'reclassify clears auto_tagged only' do
    @record.record_classifications.create!(
      classification: @tag, classifier: 'manual', confidence: 1.0, auto_tagged: false
    )

    post "/vehicles/#{@vehicle.id}/reclassify",
         headers: http_options(@session.auth_token)[:headers]
    assert_response :success

    assert @record.reload.classifications.include?(@tag)
  end
end