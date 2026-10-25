# ==========================================
# GearGuard Backend - Production Dockerfile
# ==========================================
FROM node:20-alpine

WORKDIR /app

# Install dependencies based on lockfile
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Ensure upload directory exists for multipart uploads
RUN mkdir -p uploads

# Expose backend API port
EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "server.js"]
