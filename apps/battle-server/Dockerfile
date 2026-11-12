# Build from the repository root: docker build -f apps/battle-server/Dockerfile .
FROM node:22-slim
ENV NODE_ENV=production
RUN corepack enable
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/battle-server ./apps/battle-server
RUN pnpm install --frozen-lockfile --filter battle-server...
WORKDIR /repo/apps/battle-server
USER node
EXPOSE 8080
CMD ["node_modules/.bin/tsx", "src/index.ts"]
