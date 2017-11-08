require 'mongoid-rspec'
require_relative 'support/database_cleaners.rb'
require_relative 'support/api_helper.rb'

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
