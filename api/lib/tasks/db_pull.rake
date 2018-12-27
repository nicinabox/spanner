namespace :db do
  desc 'Pull production db to development'
  task :pull => [:dump, :restore]

  task :dump do
    dumpfile = "#{Rails.root}/tmp/latest.dump"
    puts 'Dumping production database...'

    production = Rails.application.config.database_configuration['production']
    system "ssh -t root@#{ENV[PRODUCTION_SERVER_ADDRESS]} 'dokku postgres:export spanner-api' > #{dumpfile}"
    puts 'Done!'
  end

  task :restore do
    dev = Rails.application.config.database_configuration['development']
    dumpfile = "#{Rails.root}/tmp/latest.dump"

    puts 'Restoring on development database...'
    system "pg_restore --verbose --clean --no-acl --no-owner -h localhost -U #{dev['username']} -d #{dev['database']} #{dumpfile}"
    puts 'Done!'
  end
end
