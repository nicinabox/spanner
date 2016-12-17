require 'constraints/api_constraint'

Rails.application.routes.draw do
  scope module: :v2, constraints: ApiConstraint.new(version: 2) do
    resources :reminders
    resources :records
    resources :users
    resources :vehicles
  end
end
