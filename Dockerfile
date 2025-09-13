# ---- Builder stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and install all dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build TypeScript to /build
RUN npm run build

# Generate Prisma client for builder stage
RUN npx prisma generate --force

# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app

# Copy only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copy build output and Prisma files
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# ✅ Regenerate Prisma client inside the production image
RUN npx prisma generate --force

EXPOSE 4000
CMD ["node", "build/index.js"]
