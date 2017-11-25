# ThingPolicy
class ThingPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def create?
    originator?
  end

  def update?
    organizer?
  end

  def destroy?
    organizer_or_admin?
  end

  def get_linkables?
    true
  end

  def get_images?
    true
  end

  def add_image?
    member_or_organizer?
  end

  def update_image?
    organizer?
  end

  def remove_image?
    organizer_or_admin?
  end

  class Scope < Scope
    def user_roles(left_join)
      joins_clause = ["#{left_join} join Roles r on r.mname='Thing'",
                      'r.mid=Things.id',
                      "r.user_id #{user_criteria}"].join(' and ')
      if left_join
        scope.select('Things.*, r.role_name').joins(joins_clause)
      else
        scope.select('Things.*, r.role_name').joins(joins_clause)
        .where('r.role_name' => [Role::ORGANIZER, Role::MEMBER])
      end
    end

    def resolve(left_join = nil)
      user_roles(left_join)
    end
  end
end
