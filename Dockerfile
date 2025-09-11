# ---- Builder stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client in builder
RUN npx prisma generate

# Build TypeScript → outputs to /app/build
RUN npm run build


# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app

# Copy only package.json + lock file first
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copy compiled build output and prisma schema
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma

# Generate Prisma client again in production
RUN npx prisma generate

# Copy .env if you want it baked into the image (optional)
# COPY .env .env

EXPOSE 4000
CMD ["node", "build/index.js"]
