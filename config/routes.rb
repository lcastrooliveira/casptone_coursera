Rails.application.routes.draw do
  get 'authn/whoami', defaults: { format: :json }

  get 'authn/checkme'

  mount_devise_token_auth_for 'User', at: 'auth'
  scope :api, defaults: { format: :json } do
    resources :foos, except: %i[new edit]
    resources :bars, except: %i[new edit]
    resources :images, except: %i[new edit] do
      post 'thing_images', controller: :thing_images, action: :create
      get 'thing_images', controller: :thing_images, action: :image_things
      get 'linkable_things', controller: :thing_images, action: :linkable_things
    end
    resources :things, except: %i[new edit] do
      resources :thing_images, only: %i[index create update destroy]
    end
    get 'images/:id/content', as: :image_content, controller: :images,
                              action: :content, defaults: { format: :jpg }
  end

  get '/ui' => 'ui#index'
  get '/ui#' => 'ui#index'

  root 'ui#index'
end
