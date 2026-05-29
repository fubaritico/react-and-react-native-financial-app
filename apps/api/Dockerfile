# --- Build stage ---
FROM node:20-slim AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace root files needed for pnpm install
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc* ./

# Copy only the packages needed by the API
COPY apps/api/package.json apps/api/
COPY packages/prisma/package.json packages/prisma/

# Install dependencies (production only)
RUN pnpm install --frozen-lockfile --ignore-scripts --filter api-financial-app...

# Copy source code
COPY apps/api/ apps/api/
COPY packages/prisma/ packages/prisma/

# Build the API
RUN pnpm --filter api-financial-app build

# --- Production stage ---
FROM node:20-slim AS production

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc* ./
COPY apps/api/package.json apps/api/
COPY packages/prisma/package.json packages/prisma/

RUN pnpm install --frozen-lockfile --ignore-scripts --filter api-financial-app... --prod

# Copy built output
COPY --from=build /app/apps/api/dist apps/api/dist
COPY --from=build /app/packages/prisma packages/prisma

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "apps/api/dist/index.js"]
