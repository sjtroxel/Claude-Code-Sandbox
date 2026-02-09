# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Clear existing data
User.destroy_all

# Create sample users
users_data = [
  { name: "Alice Johnson", email: "alice@example.com" },
  { name: "Bob Smith", email: "bob@example.com" },
  { name: "Charlie Davis", email: "charlie@example.com" },
  { name: "Diana Prince", email: "diana@example.com" }
]

users_data.each do |user_data|
  User.create!(user_data)
end

puts "Created #{User.count} users"
