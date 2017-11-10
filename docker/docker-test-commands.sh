#!/bin/bash

/usr/local/bin/vnc.sh
set -x
rake db:create
rake db:migrate
rspec spec/features/manage_foos_spec.rb -e "updated" --fail-fast
tail -f Gemfile
