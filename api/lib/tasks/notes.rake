# frozen_string_literal: true

require 'exporter'

namespace :notes do
  desc 'Export all notes'
  task :all, [] => :environment do |_t, _args|
    records = Record.reorder('notes')
                    .select(:notes)
                    .where.not(notes: [nil, ''])
                    .distinct

    Exporter.notes(records, 'notes.csv')
  end

  desc 'Export all user notes'
  task :user, [:email] => :environment do |_t, args|
    user = User.find_by(email: args.email)
    Exporter.notes(user.records, "notes_#{args.email.parameterize.underscore}.csv")
  end

  desc 'Export all matching notes'
  task :match, %i[term limit] => :environment do |_t, args|
    records = Record.reorder('notes')
                    .select(:notes)
                    .where('notes ILIKE ?', "%#{args.term.downcase}%")
                    .distinct
                    .limit(args.limit || 100)

    Exporter.notes(records, "notes_#{args.term.parameterize.underscore}.csv")
  end
end
