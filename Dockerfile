FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests first
COPY package*.json ./

# Force install EXACTLY what is in package-lock.json if present
RUN npm ci || npm install --legacy-peer-deps

# Copy the full source
COPY . .

# Generate Prisma client inside build stage
RUN npx prisma generate

# Build TS to JS
RUN npm run build


# ----------------- Production stage -----------------
FROM node:20-alpine

WORKDIR /app

# Copy only package files first
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production || npm install --only=production --legacy-peer-deps

# Copy compiled code + Prisma
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Make sure Prisma client exists
RUN npx prisma generate

EXPOSE 4000
CMD ["node", "build/index.js"]
