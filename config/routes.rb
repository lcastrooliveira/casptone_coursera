Rails.application.routes.draw do
  get 'authn/whoami'

  get 'authn/checkme'

  mount_devise_token_auth_for 'User', at: 'auth'
  scope :api, defaults: { format: :json } do
    resources :foos, except: %i[new edit]
    resources :bars, except: %i[new edit]
    resources :images, except: %i[new edit]
    resources :things, except: %i[new edit]
  end

  get '/ui' => 'ui#index'
  get '/ui#' => 'ui#index'

  root 'ui#index'
end
