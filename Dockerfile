FROM node:20-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code + Prisma schema
COPY . .

EXPOSE 4000
# ✅ Run Prisma generate at container start
ENV NODE_ENV=production
CMD npx prisma generate && node build/index.js
