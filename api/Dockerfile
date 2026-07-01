# api/Dockerfile
FROM ruby:3.4.6-slim-bookworm AS base

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential libpq-dev curl libyaml-dev libffi-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install gems
COPY Gemfile Gemfile.lock ./
RUN bundle install --jobs=4 --retry=3

# Copy application code
COPY . .

# Expose Puma port
EXPOSE 3001

# Entrypoint: run migrations, then start Puma
COPY docker-entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["sh", "-c", "rails server -b 0.0.0.0 -p ${PORT:-3001}"]
