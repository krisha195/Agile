# ==========================================
# GearGuard Frontend - Multi-Stage Dockerfile
# ==========================================
# Stage 1: Build production React bundle
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV CI=false
ENV REACT_APP_API_URL=/api

RUN npm run build

# Stage 2: Serve via Nginx Alpine
FROM nginx:alpine

# Copy built assets to Nginx html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx reverse proxy & SPA configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
