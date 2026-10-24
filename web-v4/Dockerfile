# web-v4/Dockerfile
# check=skip=SecretsUsedInArgOrEnv
FROM oven/bun:1.4.4-slim AS build

# SvelteKit validates env vars at build time via defineEnvVars. ARG values
# are scoped to this build stage; ENV values persist into the final image.
# Railway exposes service variables to Dockerfile builds via matching ARG names.
ARG API_URL
ARG CLIENT_SECRET

ENV API_URL=$API_URL
ENV CLIENT_SECRET=$CLIENT_SECRET

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Generate SvelteKit types
RUN bun run prepare

# Copy source and build
COPY . .
RUN bun run build

FROM oven/bun:1.4.4-slim

ENV NODE_ENV=production

WORKDIR /app

# Install production-only dependencies for the runtime image.
COPY package.json bun.lock* ./
RUN bun install --production --frozen-lockfile

COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["bun", "build/index.js"]
