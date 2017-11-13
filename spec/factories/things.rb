FactoryGirl.define do
  factory :thing do
    name { Faker::Name.name }
    notes { Faker::Lorem.sentence(1).chomp('.') }
    description { Faker::Lorem.sentence(1).chomp('.') }
  end
end
