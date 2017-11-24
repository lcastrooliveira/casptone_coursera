# Role
class Role < ActiveRecord::Base
  ADMIN = 'admin'.freeze
  ORIGINATOR = 'originator'.freeze
  ORGANIZER = 'organizer'.freeze
  MEMBER = 'member'.freeze
  belongs_to :user, inverse_of: :roles

  scope :relevant, ->(model_name, model_id) {
    where('mname is null or (mname=:mname and (mid is null or mid=:mid))',
          mname: model_name, mid: model_id)
  }
end
