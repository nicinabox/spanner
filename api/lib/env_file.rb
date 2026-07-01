# frozen_string_literal: true

class EnvFile
  def self.read(path:)
    new(content: File.read(path), path: path)
  end

  def initialize(content: '', path: nil)
    @path = path
    @lines = content.each_line.map(&:chomp)
    @keys = {}
    parse_lines
  end

  delegate :[], to: :@keys

  def set(key, value)
    key = key.to_s
    if @keys.key?(key)
      @lines.each_with_index do |line, i|
        next unless line.match?(/\A#{Regexp.escape(key)}=/)

        @lines[i] = "#{key}=#{value}"
        @keys[key] = value
        break
      end
    end
    @lines << "#{key}=#{value}"
    @keys[key] = value
  end

  def assign_unless_present(key)
    return if @keys.key?(key)

    set(key, yield)
  end

  def to_s
    "#{@lines.join("\n")}\n"
  end

  def save(path: nil)
    path ||= @path
    File.write(path, to_s)
  end

  private

  def parse_lines
    @lines.each do |line|
      match = line.match(/\A([A-Z_][A-Z0-9_]*)=(.*)\z/)
      next unless match

      @keys[match[1]] = match[2]
    end
  end
end
