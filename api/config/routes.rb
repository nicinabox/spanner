require 'constraints/api_constraint'

Rails.application.routes.draw do
  root 'status#index'

  scope module: :v2 do
    post 'sessions', to: 'sessions#create'

    get 'login(/:login_token)', to: 'sessions#login', as: 'login'
  end

  scope module: :v2, constraints: ApiConstraint.new(version: 2) do
    resources :vehicles do
      resources :reminders
      resources :records
    end

    get 'user', to: 'users#index'
    put 'user', to: 'users#update'

    delete 'sessions/:id', to: 'sessions#destroy'
    get 'sessions', to: 'sessions#index'
  end
end
