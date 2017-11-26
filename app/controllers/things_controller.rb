# ThingsController
class ThingsController < ApplicationController
  include ActionController::Helpers
  helper ThingsHelper
  before_action :set_thing, only: %i[show update destroy]
  wrap_parameters :thing, include: %w[name description notes]
  before_action :authenticate_user!, except: %i[show index]
  # before_action :authenticate_user!, only: %i[create update destroy]
  after_action :verify_authorized
  after_action :verify_policy_scoped, only: :index

  def index
    authorize Thing
    things = policy_scope(Thing.all)
    @things = ApplicationPolicy.merge(things)
  end

  def show
    authorize @thing
    # things = policy_scope(Thing.where(id: @thing.id))
    things = ThingPolicy::Scope.new(current_user, Thing.where(id: @thing.id))
                               .user_roles(false)
    @thing = ApplicationPolicy.merge(things).first
  end

  def create
    authorize Thing
    @thing = Thing.new(thing_params)

    User.transaction do
      if @thing.save
        role = current_user.add_role(Role::ORGANIZER, @thing)
        @thing.user_roles << role.role_name
        role.save!
        render :show, status: :created, location: @thing
      else
        render json: { errors: @show.errors.messages },
               status: :unprocessable_entity
      end
    end
  end

  def update
    authorize @thing
    if @thing.update(thing_params)
      head :no_content
    else
      render json: { errors: @thing.errors.messages },
             status: :unprocessable_entity
    end
  end

  def destroy
    authorize @thing
    @thing.destroy
    head :no_content
  end

  private

  def set_thing
    @thing = Thing.find(params[:id])
  end

  def thing_params
    params.require(:thing).tap { |p| p.require(:name) }
          .permit(:name, :description, :notes)
  end
end
