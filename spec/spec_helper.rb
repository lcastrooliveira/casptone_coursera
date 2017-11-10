require 'mongoid-rspec'
require_relative 'support/database_cleaners.rb'
require_relative 'support/api_helper.rb'
require_relative 'support/foo_ui_helper.rb'
require 'capybara/rspec'
require 'capybara/poltergeist'

Capybara.register_driver :selenium do |app|
  if ENV['SELENIUM_REMOTE_HOST']
    SELENIUM_URL = "http://#{ENV['SELENIUM_REMOTE_HOST']}:4444/wd/hub".freeze
    # https://medium.com/@georgediaz/docker-container-for-running-browser-tests-9b234e68f83c#.l7i6yay23
    Capybara.app_host = "http://test:#{ENV['APP_PORT']}"
    puts "Capybara.app_host=#{Capybara.app_host}"
    Capybara.server_host = '0.0.0.0'
    Capybara.server_port = ENV['APP_PORT']
    Capybara::Selenium::Driver.new(app,
                                   browser: :remote,
                                   url: SELENIUM_URL,
                                   desired_capabilities: :chrome)
  end
end

RSpec.configure do |config|
  config.include Mongoid::Matchers, orm: :mongoid
  config.include ApiHelper, type: :request

  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end
  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end
  config.shared_context_metadata_behavior = :apply_to_host_groups
end

Capybara.configure do |config|
  config.default_driver = :rack_test
  config.javascript_driver = :poltergeist
  # config.javascript_driver = :selenium
end

Capybara.register_driver :poltergeist do |app|
  Capybara::Poltergeist::Driver.new(app, phantomjs_logger: StringIO.new)
end

if ENV['COVERAGE']
  require 'simplecov'
  SimpleCov.start do
    add_filter '/spec'
    add_filter '/config'
    add_group 'foos', ['foo']
    add_group 'bars', ['bar']
  end
end
