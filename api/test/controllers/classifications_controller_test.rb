# frozen_string_literal: true

require 'test_helper'

class ClassificationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    new_session
  end

  test 'returns system classifications' do
    get classifications_url, headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    body = response_body
    assert body.is_a?(Array)
    assert(body.any? { |c| c['key'] == 'oil_change' })
  end

  test 'index returns system and vehicle classifications' do
    vehicle = @user.vehicles.first
    Classification.create!(name: 'Hull Clean', vehicle: vehicle, user: @user, system: false)

    get vehicle_classifications_url(vehicle),
        headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    body = response_body
    assert(body.any? { |c| c['key'] == 'oil_change' })
    assert(body.any? { |c| c['name'] == 'Hull Clean' })
  end

  test 'create user classification on vehicle' do
    vehicle = @user.vehicles.first
    post vehicle_classifications_url(vehicle),
         params: { classification: { name: 'Hull Cleaning', keywords: ['hull'] } },
         headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    assert Classification.find_by(name: 'Hull Cleaning', vehicle_id: vehicle.id)
  end

  test 'update user classification keywords' do
    vehicle = @user.vehicles.first
    tag = Classification.create!(name: 'Hull Clean', vehicle: vehicle, user: @user, system: false)
    put classification_url(tag),
        params: { classification: { keywords: ['hull clean', 'zincs'] } },
        headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    assert_equal ['hull clean', 'zincs'], tag.reload.keywords
  end

  test 'cannot delete system classification' do
    system_tag = Classification.system.first
    delete classification_url(system_tag),
           headers: http_options(@session.auth_token)[:headers]
    assert_response :unprocessable_entity
  end

  test 'cannot delete classification referenced by schedules' do
    vehicle = @user.vehicles.first
    tag = Classification.create!(name: 'Hull Clean', vehicle: vehicle, user: @user, system: false)
    ServiceSchedule.create!(vehicle: vehicle, classification: tag, distance_interval: 5000)

    delete classification_url(tag),
           headers: http_options(@session.auth_token)[:headers]
    assert_response :unprocessable_entity
  end
end
