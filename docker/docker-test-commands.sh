#!/bin/bash

/usr/local/bin/vnc.sh
set -x
rake db:create RAILS_ENV=test
rake db:migrate RAILS_ENV=test
rspec spec/features/geocodes_spec.rb -e "identifies origin by current location"
tail -f Gemfile
