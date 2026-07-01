# web-v4/Dockerfile
FROM node:lts-bookworm-slim AS build

ARG API_URL
ARG CLIENT_SECRET

ENV API_URL=$API_URL
ENV CLIENT_SECRET=$CLIENT_SECRET

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Generate SvelteKit types (npm ci skips prepare script)
RUN npm run prepare

# Copy source and build
COPY . .
RUN npm run build

# Production image
FROM node:lts-bookworm-slim

WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "build/index.js"]
