FROM node:20-alpine

WORKDIR /app

# Install all dependencies (including dev for Prisma)
COPY package*.json ./
RUN npm ci

# Copy source code + Prisma schema
COPY . .

# Generate Prisma client before building
RUN npx prisma generate

# Build the application
RUN npm run build

EXPOSE 5000
# ✅ Run migrate at container start
ENV NODE_ENV=production
CMD npx prisma migrate deploy && node build/index.js
