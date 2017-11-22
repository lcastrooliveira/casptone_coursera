#!/bin/bash

/usr/local/bin/vnc.sh
set -x
rake db:create RAILS_ENV=test
rake db:migrate RAILS_ENV=test
rspec spec/features/authz_things_spec.rb -e "things posted user selects thing authenticated user behaves like displays thing can display specific thing" --fail-fast
tail -f Gemfile
