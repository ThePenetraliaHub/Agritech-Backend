# ---- Builder stage ----
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# Build TypeScript
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copy compiled build + prisma schema
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma

# ✅ Also copy @prisma/client package (needed to import PrismaClient)
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# ✅ Generate Prisma client inside final image
RUN npx prisma generate

EXPOSE 4000
CMD ["node", "build/index.js"]
