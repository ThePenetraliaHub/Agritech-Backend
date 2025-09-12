# ---- Builder stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install all deps (dev + prod)
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .

# Generate Prisma client (using schema + env)
RUN npx prisma generate

# Build TypeScript
RUN npm run build


# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app

# Copy package.json + lock
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copy Prisma schema and client (important!)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy compiled build output
COPY --from=builder /app/build ./build

# Optional: copy .env if you want it inside container
# COPY .env .env

EXPOSE 4000

CMD ["node", "build/index.js"]