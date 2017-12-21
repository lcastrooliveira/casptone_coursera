FactoryGirl.define do
  factory :image_content do
    content_type 'image/jpg'
    sequence(:content) do |idx|
      File.open('db/images/sample.jpg', 'rb') do |f|
        image = StringIO.new(f.read)
        image = ImageContentCreator.annotate(idx, image)
        Base64.encode64(image)
      end
    end
    original false
  end
end
