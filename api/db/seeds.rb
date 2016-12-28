# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

user = User.find_or_initialize_by(email: 'demo@spanner')
user.update_attributes(
  login_token: SecureRandom.urlsafe_base64,
  login_token_valid_until: Time.now + 10.years
)

puts "Demo user login token: #{user.login_token}"
