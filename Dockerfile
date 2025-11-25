FROM node:20-alpine

WORKDIR /app

# Install all dependencies (including dev for Prisma)
COPY package*.json ./
RUN npm ci

# Copy source code + Prisma schema
COPY . .

EXPOSE 5000
# ✅ Run Prisma generate and seed at container start
ENV NODE_ENV=production
CMD npx prisma generate && npm run prisma:seed && node build/index.js
