# FROM node:20-alpine

# WORKDIR /

# # Install production dependencies
# COPY package*.json ./
# RUN npm ci --only=production

# # Copy source code + Prisma schema
# COPY . .

# EXPOSE 4000
# # ✅ Run Prisma generate at container start
# ENV NODE_ENV=production
# CMD npx prisma generate && node build/index.js
# Stage 1: Build the app
FROM node:20 AS build

WORKDIR /app

# Copy dependency files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build TypeScript into JavaScript
RUN yarn ci && yarn build


# Stage 2: Run the app
FROM node:20

WORKDIR /app

# Copy package + lockfile
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Expose the app port
EXPOSE 5000

# Start the server
CMD ["node", "dist/index.js"]