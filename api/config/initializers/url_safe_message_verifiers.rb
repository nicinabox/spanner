# frozen_string_literal: true

# Generate URL-safe signed tokens so they can be used directly in URL paths
# (e.g. Rails 8 password reset tokens via has_secure_password).
# MessageVerifier accepts both URL-safe and legacy tokens for verification,
# so existing tokens remain valid until they expire.
Rails.application.message_verifiers.clear_rotations
Rails.application.message_verifiers.rotate(url_safe: true)
