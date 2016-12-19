require 'constraints/api_constraint'

Rails.application.routes.draw do
  scope module: :v2 do
    post 'sessions', to: 'sessions#create'
    get 'sessions/:login_token', to: 'sessions#login'
  end

  scope module: :v2, constraints: ApiConstraint.new(version: 2) do
    resources :reminders
    resources :records
    resources :vehicles

    get 'user', to: 'users#index'

    delete 'sessions', to: 'sessions#destroy'
    get 'sessions', to: 'sessions#index'
  end
end
