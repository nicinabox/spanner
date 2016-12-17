Rails.application.routes.draw do
  resources :reminders
  resources :records
  resources :users
  resources :vehicles
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
