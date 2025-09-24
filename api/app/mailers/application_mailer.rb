# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  include ActionView::Helpers::DateHelper

  default from: 'spanner@nicinabox.com'
  layout 'mailer'
end
