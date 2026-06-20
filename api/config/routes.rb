# frozen_string_literal: true

require 'constraints/api_constraint'

Rails.application.routes.draw do
  root 'status#index'

  scope module: :v2 do
    post 'sessions', to: 'sessions#create'

    get 'login(/:login_token)', to: 'sessions#login', as: 'login'
    get 'confirm_email(/:token)', to: 'users#confirm_email', as: 'confirm_email'

    post 'webhooks/postmark', to: 'postmark#webhook'
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
    post 'user/email_change', to: 'users#request_email_change', as: 'email_change_user'

    delete 'sessions/:id', to: 'sessions#destroy'
    get 'sessions', to: 'sessions#index'
  end
end
