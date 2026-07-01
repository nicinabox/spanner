# frozen_string_literal: true

require 'test_helper'

class EnvFileTest < ActiveSupport::TestCase
  test 'reads existing env file' do
    file = EnvFile.read(path: 'test/fixtures/files/.env.example')
    assert_equal 'value1', file['KEY1']
    assert_equal 'value2', file['KEY2']
  end

  test 'returns nil for missing key' do
    file = EnvFile.read(path: 'test/fixtures/files/.env.example')
    assert_nil file['NONEXISTENT']
  end

  test 'sets new key' do
    file = EnvFile.new
    file.set('NEW_KEY', 'new_value')
    assert_equal 'new_value', file['NEW_KEY']
  end

  test 'updates existing key' do
    file = EnvFile.read(path: 'test/fixtures/files/.env.example')
    file.set('KEY1', 'updated')
    assert_equal 'updated', file['KEY1']
  end

  test 'preserves comments and blank lines' do
    file = EnvFile.read(path: 'test/fixtures/files/.env.example')
    output = file.to_s
    assert_includes output, '# This is a comment'
    assert_includes output, "\n\n"
  end

  test 'writes file' do
    Dir.mktmpdir do |dir|
      path = File.join(dir, '.env')
      File.write(path, "KEY1=old\n")
      file = EnvFile.read(path: path)
      file.set('KEY1', 'new')
      file.set('KEY2', 'added')
      file.save
      content = File.read(path)
      assert_includes content, 'KEY1=new'
      assert_includes content, 'KEY2=added'
    end
  end

  test 'generates missing secrets' do
    file = EnvFile.new
    file.assign_unless_present('SECRET') { SecureRandom.hex(32) }
    assert_match(/\A[0-9a-f]{64}\z/, file['SECRET'])
  end

  test 'preserves existing secrets' do
    file = EnvFile.read(path: 'test/fixtures/files/.env.example')
    file.assign_unless_present('KEY1') { 'should_not_appear' }
    assert_equal 'value1', file['KEY1']
  end
end
