# ---- Base image ----
FROM node:20-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code directly (skip TypeScript build)
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 4000

# Run Node directly on source (if compiled JS exists in build, use build/index.js)
CMD ["node", "src/index.js"]
