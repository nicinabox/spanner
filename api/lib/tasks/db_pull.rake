# frozen_string_literal: true

namespace :db do
  desc 'Pull production db to development'
  task pull: %i[dump restore]

  task dump: :environment do
    dumpfile = Rails.root.join('tmp/latest.dump').to_s
    puts 'Dumping production database...'

    Rails.application.config.database_configuration['production']
    system "ssh -t root@#{ENV.fetch('PRODUCTION_SERVER_ADDRESS',
                                    nil)} 'dokku postgres:export spanner-api' > #{dumpfile}"
    puts 'Done!'
  end

  task restore: :environment do
    dev = Rails.application.config.database_configuration['development']
    dumpfile = Rails.root.join('tmp/latest.dump').to_s

    puts 'Restoring on development database...'
    system "pg_restore --verbose --clean --no-acl --no-owner -h localhost -U #{dev['username']} -d #{dev['database']} #{dumpfile}"
    puts 'Done!'
  end
end
