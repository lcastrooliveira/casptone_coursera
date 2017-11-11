#!/bin/bash

/usr/local/bin/vnc.sh
set -x
rake db:create RAILS_ENV=test
rake db:migrate RAILS_ENV=test
rspec spec/features/manage_foos_spec.rb -e "updated" --fail-fast
tail -f Gemfile
