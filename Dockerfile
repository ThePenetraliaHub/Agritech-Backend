# ---- Builder stage ----
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma

# ✅ Run prisma generate in the final image
RUN npm prisma generate

EXPOSE 4000
CMD ["node", "build/index.js"]
