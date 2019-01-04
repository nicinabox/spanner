class GoodJob < ApplicationJob
  def perform(object, method)
    object.try(method)
  end
end
