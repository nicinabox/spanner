# web-v4/Dockerfile
# check=skip=SecretsUsedInArgOrEnv
FROM node:lts-bookworm-slim AS build

# SvelteKit validates env vars at build time via defineEnvVars. ARG values
# are scoped to this build stage; ENV values persist into the final image.
# Railway exposes service variables to Dockerfile builds via matching ARG names.
ARG API_URL
ARG CLIENT_SECRET
ARG SENTRY_AUTH_TOKEN

ENV API_URL=$API_URL
ENV CLIENT_SECRET=$CLIENT_SECRET
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

WORKDIR /app

# Install dependencies. ca-certificates is needed for sentry-cli to verify
# sentry.io TLS during source map upload.
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y ca-certificates && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

COPY package.json package-lock.json ./
RUN npm ci

# Generate SvelteKit types (npm ci skips prepare script)
RUN npm run prepare

# Copy source and build
COPY . .
RUN npm run build

# Production image
FROM node:lts-bookworm-slim

ENV NODE_ENV=production

WORKDIR /app

# Install only production dependencies. Excludes devDependencies like
# vitest, playwright, prettier, svelte-check, typescript, @types/* —
# all unused at runtime. Cuts ~150-200 MB from the runtime image.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["node", "build/index.js"]