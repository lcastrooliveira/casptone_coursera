# ThingImagesController
class ThingImagesController < ApplicationController
  wrap_parameters :thing_images, include: %w[image_id thing_id priority]
  before_action :get_thing, only: %i[index update destroy]
  before_action :get_thing_image, only: %i[update destroy]
  before_action :authenticate_user!, only: %i[create update destroy]

  def index
    @thing_images = @thing.thing_images.prioritized.with_caption
  end

  def image_things
    image = Image.find(params[:image_id])
    @thing_images = image.thing_images.prioritized.with_caption
    render :index
  end

  def linkable_things
    image = Image.find(params[:image_id])
    @thigns = Thing.not_linked(image)
    render 'things/index'
  end

  def create
    thing_image = ThingImage.new(thing_image_create_params.merge({
                                  image_id: params[:image_id],
                                  thing_id: params[:thing_id]
      }))
  end

  private

  def get_thing
    @thing ||= Thing.find(params[:thing_id])
  end

  def get_thing_image
    @thing_image ||= ThingImage.find(params[:id])
  end

  def thing_image_create_params
    params.require(:thing_image).tap do |p|
      p.require(:image_id) unless params[:image_id]
      p.require(:thing_id) unless params[:thing_id]
    end.permit(:priority, :image_id, :thing_id)
  end

  def thing_image_update_params
    params.require(:thing_image).permit(:priority)
  end
end
