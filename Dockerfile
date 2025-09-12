# ---- Builder stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copy build output and prisma schema
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma

# ✅ Copy Prisma client artifacts (this is what you’re missing)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# ✅ Also copy @prisma/client itself, since it depends on the generated client
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 4000
CMD ["node", "build/index.js"]
