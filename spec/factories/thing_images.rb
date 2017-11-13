FactoryGirl.define do
  factory :thing_image do
    creator_id 1
    after(:build) do |link|
      link.image = FactoryGirl.build(:image) unless link.image
    end
  end
end
