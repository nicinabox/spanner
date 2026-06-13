# frozen_string_literal: true

namespace :classifications do
  desc 'Backfill record classifications for existing records using the heuristic classifier'
  task backfill: :environment do
    total = Record.count
    processed = 0

    Record.find_each do |record|
      record.classify_notes
      processed += 1
      puts "Classified #{processed}/#{total} records" if (processed % 100).zero?
    end

    puts "Backfilled classifications for #{processed} records."
  end
end
