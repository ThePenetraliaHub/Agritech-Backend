# ---- Builder stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install dev dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript to /build
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app

# Copy package.json and install only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copy build output
COPY --from=builder /app/build ./build

# Copy Prisma schema and generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 4000

# Run the compiled app
CMD ["node", "build/index.js"]
