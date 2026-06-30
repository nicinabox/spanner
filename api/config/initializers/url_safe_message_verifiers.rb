# frozen_string_literal: true

# Generate URL-safe signed tokens so they can be used directly in URL paths
# (e.g. Rails 8 password reset tokens via has_secure_password).
# MessageVerifier accepts both URL-safe and legacy tokens for verification,
# so existing tokens remain valid until they expire.
Rails.application.config.after_initialize do |app|
  verifiers = app.message_verifiers
  verifiers.clear_rotations
  verifiers.rotate(url_safe: true)

  # Active Record's token verifier is captured at boot; reassign it so new
  # tokens are generated with the URL-safe rotation first.
  ActiveRecord::Base.generated_token_verifier = app.message_verifier('active_record/token_for')
end
