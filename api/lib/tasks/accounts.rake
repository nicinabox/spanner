namespace :accounts do
  desc "Create or update demo account"
  task seed_demo: :environment do
    user = User.find_or_initialize_by(email: 'demo@spanner')
    user.update(
      login_token: SecureRandom.urlsafe_base64,
      login_token_valid_until: Time.now + 10.years
    )

    puts "Demo user login token: #{user.login_token}"
    puts "You may run this task again to generate a new token."
  end
end
