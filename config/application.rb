require File.expand_path('../boot', __FILE__)

require 'rails'
# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_job/railtie'
require 'active_record/railtie'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'action_view/railtie'
require 'sprockets/railtie'
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Myapp
  # Application
  class Application < Rails::Application
    Mongoid.load! './config/mongoid.yml'
    config.generators { |g| g.orm :active_record }

    config.middleware.insert_before 0, 'Rack::Cors' do
      allow do
        origins 'https://lcastro-coursera-staging.herokuapp.com',
                'https://lcastro-coursera-prod.herokuapp.com'
        resource '*', headers: :any,
                      methods: %i[get post put delete options],
                      expose: %w[access-token expirity tokey-type uid client]
      end
    end

    config.generators do |g|
      g.test_framework :rspec,
                       model_specs: true,
                       routing_specs: true,
                       controller_specs: false,
                       helper_specs: false,
                       view_specs: false,
                       request_specs: true,
                       policy_specs: false,
                       feature_specs: true
    end

    # Do not swallow errors in after_commit/after_rollback callbacks.
    config.active_record.raise_in_transactional_callbacks = true
  end
end
