FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript → goes into /app/build
RUN npm run build

# ---- Production image ----
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copy compiled build output
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000

CMD ["node", "build/index.js"]
