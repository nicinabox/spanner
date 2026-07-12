# frozen_string_literal: true

require 'test_helper'

class ClassificationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    new_session
  end

  test 'index returns vehicle classifications' do
    vehicle = @user.vehicles.first
    Classification.create!(name: 'Hull Clean', vehicle: vehicle, keywords: ['hull'])

    get vehicle_classifications_url(vehicle),
        headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    body = response_body
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
    tag = Classification.create!(name: 'Hull Clean', vehicle: vehicle, keywords: ['hull'])
    put classification_url(tag),
        params: { classification: { keywords: ['hull clean', 'zincs'] } },
        headers: http_options(@session.auth_token)[:headers]
    assert_response :success
    assert_equal ['hull clean', 'zincs'], tag.reload.keywords
  end

  test 'cannot delete classification referenced by schedules' do
    vehicle = @user.vehicles.first
    tag = Classification.create!(name: 'Hull Clean', vehicle: vehicle, keywords: ['hull'])
    ServiceSchedule.create!(vehicle: vehicle, classification: tag, distance_interval: 5000)

    delete classification_url(tag),
           headers: http_options(@session.auth_token)[:headers]
    assert_response :unprocessable_entity
  end
end
