FactoryGirl.define do
  factory :image do
    sequence(:caption) do |n|
      n.even? ? nil : Faker::Lorem.sentence(1).chomp('.')
    end
    trait :with_caption do
      caption { Faker::Lorem.sentence(1).chomp('.') }
    end
    creator_id 1
  end
end
