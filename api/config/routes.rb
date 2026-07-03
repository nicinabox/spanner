# frozen_string_literal: true

require 'constraints/api_constraint'

Rails.application.routes.draw do # rubocop:disable Metrics/BlockLength
  root 'status#index'

  direct :web_root do
    Rails.application.config.x.web_url
  end

  direct :web_vehicle, vehicle: nil do |options|
    "#{Rails.application.config.x.web_url}/vehicles/#{options[:vehicle].id}"
  end

  direct :web_preferences, token: nil, vehicle_id: nil do |options|
    path = "/preferences/#{options[:token]}"
    path += "?vehicle_id=#{options[:vehicle_id]}" if options[:vehicle_id]
    "#{Rails.application.config.x.web_url}#{path}"
  end

  direct :web_reset_password, token: nil do |options|
    "#{Rails.application.config.x.web_url}/reset-password/#{options[:token]}"
  end

  scope module: :v2 do
    post 'sessions', to: 'sessions#create'
    post 'login', to: 'logins#create', as: nil

    get 'login(/:login_token)', to: 'sessions#login', as: 'login'
    get 'confirm_email(/:token)', to: 'users#confirm_email', as: 'confirm_email'
    scope 'account(/:token)' do
      get  '/',                  to: 'users#account',            as: 'account'
      post '/',                  to: 'users#account_action',     as: 'account_action'
      post '/preferences',       to: 'users#account_preferences', as: 'account_preferences'
    end

    post 'password/reset', to: 'passwords#create_reset'
    post 'password/reset/:token', to: 'passwords#reset'

    post 'webhooks/postmark', to: 'postmark#webhook'
    post 'webhooks/test', to: 'webhooks#test'
  end

  scope module: :v2, constraints: ApiConstraint.new(version: 2) do
    resources :classifications, only: :index

    resources :vehicles do
      resources :service_schedules do
        post :complete, on: :member
      end

      get 'reminders/estimate_date', to: 'reminders#estimate_date'
      resources :reminders

      get :share
      get 'records/share', to: 'records#share'

      resources :records do
        delete 'attachments/:signed_id', to: 'records#destroy_attachment', as: :attachment
      end

      post :import
      get :export
    end

    resources :reminders, only: :index

    get 'user', to: 'users#index'
    put 'user', to: 'users#update'
    delete 'user', to: 'users#destroy'
    post 'user/email_change', to: 'users#request_email_change', as: 'email_change_user'

    put 'password', to: 'passwords#update'

    delete 'sessions/:id', to: 'sessions#destroy'
    get 'sessions', to: 'sessions#index'
  end
end
