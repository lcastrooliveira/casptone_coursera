# ApplicationController
class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  include ActionController::ImplicitRender
  before_action :configure_permitted_parameters, if: :devise_controller?

  rescue_from ActiveRecord::RecordNotFound, Mongoid::Errors::DocumentNotFound,
              with: :record_not_found

  rescue_from ActionController::ParameterMissing, with: :parameter_missing

  protected

  def full_message_error(full_message, status)
    payload = {
      errors: { full_messages: ["#{full_message}]"] }
    }
    render json: payload, status: status
  end

  def record_not_found(exception)
    full_message_error "cannot find id [#{params[:id]}]", :not_found
    Rails.logger.debug exception.message
  end

  def parameter_missing(exception)
    payload = {
      errors: { full_messages: [exception.message] }
    }
    render json: payload, status: :bad_request
    Rails.logger.debug exception.message
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end
end
