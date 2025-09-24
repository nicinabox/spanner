Bugsnag.configure do |config|
  config.api_key = "59064ed6db9bd085be21fb5ca3d529c3"
  config.release_stage = Rails.env
  config.notify_release_stages = ['production']
end
