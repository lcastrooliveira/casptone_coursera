#!/bin/bash

/usr/local/bin/vnc.sh
set -x
rake db:create RAILS_ENV=test
rake db:migrate RAILS_ENV=test
rspec spec/features/authz_things_spec.rb -e "AuthzThings no thing selected admin user behaves like can list things lists things"
tail -f Gemfile
