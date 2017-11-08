# ApplicationController
class ApplicationController < ActionController::API
  include ActionController::ImplicitRender

  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  protected

  def record_not_found(exception)
    payload = {
      errors: { full_messages: ["cannot find id [#{params[:id]}]"] }
    }
    render json: payload, status: :not_found
    Rails.logger.debug exception.message
  end
end
