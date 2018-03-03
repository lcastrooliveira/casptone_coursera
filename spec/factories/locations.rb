FactoryGirl.define do
  factory :point do
    transient do
      lng { Faker::Number.negative(-77.0, -76.0).round(6) }
      lat { Faker::Number.positive(38.7, 39.7).round(6) }
    end
    initialize_with { Point.new(lng, lat) }
    trait :jhu do
      lng -76.6200464
      lat 39.3304957
    end
  end
end
