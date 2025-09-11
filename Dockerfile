FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./ 
RUN npm ci --only=production

# Copy compiled build output and prisma folder
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma

# ⚡ Generate Prisma client again inside production image
RUN npx prisma generate

EXPOSE 4000
CMD ["node", "build/index.js"]
