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

  class Scope < Scope
    def user_roles(action)
      if action == :index
        joins_clause = ["join Roles r on r.mname='Thing'",
                        'r.mid=Things.id',
                        "r.user_id #{user_criteria}"].join(' and ')
        scope.select('Things.*, r.role_name').joins(joins_clause)
             .where('r.role_name' => [Role::ORGANIZER, Role::MEMBER])
      elsif action == :show
        joins_clause = ["left join Roles r on r.mname='Thing'",
                        'r.mid=Things.id',
                        "r.user_id #{user_criteria}"].join(' and ')
        scope.select('Things.*, r.role_name').joins(joins_clause)
      end
    end

    def resolve(action = :index)
      user_roles(action)
    end
  end
end
