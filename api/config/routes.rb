require 'constraints/api_constraint'

Rails.application.routes.draw do
  scope module: :v2, constraints: ApiConstraint.new(version: 2) do
    resources :reminders
    resources :records
    resources :vehicles

    get 'user', to: 'users#index'

    post 'sessions', to: 'sessions#create'
    get 'sessions/:login_token', to: 'sessions#login'
    delete 'sessions', to: 'sessions#destroy'
  end
end
