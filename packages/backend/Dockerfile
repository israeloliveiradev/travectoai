FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/

RUN npm install

COPY packages/backend ./packages/backend

WORKDIR /app/packages/backend
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY package.json package-lock.json* ./
COPY packages/backend/package.json ./packages/backend/

RUN npm install --omit=dev

COPY --from=builder /app/packages/backend/dist ./packages/backend/dist

EXPOSE 3001

CMD ["node", "packages/backend/dist/server.js"]

