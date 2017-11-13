FactoryGirl.define do
  factory :thing do
    name { Faker::Name.name }
    notes { Faker::Lorem.sentence(1).chomp('.') }
    description { Faker::Lorem.sentence(1).chomp('.') }

    trait :with_image do
      transient do
        image_count 1
      end
      after(:build) do |thing, props|
        thing.thing_images << FactoryGirl.build_list(:thing_image,
                                                     props.image_count,
                                                     thing: thing)
      end
    end
  end
end
