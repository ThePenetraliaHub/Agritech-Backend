# ---- Builder stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install all deps including dev (Prisma CLI lives here)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TS
RUN npm run build


# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copy prisma schema
COPY --from=builder /app/prisma ./prisma

# Copy compiled code
COPY --from=builder /app/build ./build

# ⚡ Re-generate Prisma client using the installed @prisma/client version
RUN npx prisma generate

EXPOSE 4000
CMD ["node", "build/index.js"]
