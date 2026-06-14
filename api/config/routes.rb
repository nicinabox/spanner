require 'constraints/api_constraint'

Rails.application.routes.draw do
  root 'status#index'

  scope module: :v2 do
    post 'sessions', to: 'sessions#create'

    get 'login(/:login_token)', to: 'sessions#login', as: 'login'

    get 'unsubscribe/:token', to: 'unsubscribes#show', as: 'unsubscribe'
    post 'prompt_controls/:token/remind_me_later', to: 'prompt_controls#remind_me_later', as: 'remind_me_later'
    post 'prompt_controls/:token/mute', to: 'prompt_controls#mute', as: 'mute_prompt'
  end

  scope module: :v2, constraints: ApiConstraint.new(version: 2) do
    resources :vehicles do
      get 'reminders/estimate_date', to: 'reminders#estimate_date'
      resources :reminders

      get :share
      get 'records/share', to: 'records#share'

      resources :records

      post :import
      get :export
    end

    resources :reminders, only: :index

    get 'user', to: 'users#index'
    put 'user', to: 'users#update'

    delete 'sessions/:id', to: 'sessions#destroy'
    get 'sessions', to: 'sessions#index'

    get 'analytics', to: 'analytics#index'
  end
end
