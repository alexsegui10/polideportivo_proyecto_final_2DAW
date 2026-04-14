FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Variables de entorno de Vite (se inyectan en build)
ARG VITE_API_URL
ARG VITE_SPRINGBOOT_URL
ARG VITE_STRIPE_PUBLIC_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SPRINGBOOT_URL=$VITE_SPRINGBOOT_URL
ENV VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY

# Build the app
RUN npm run build

# ── Production: nginx con proxy a SpringBoot y FastAPI ──
FROM nginx:alpine

# Copiar build de React
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración nginx (incluye proxy /api/springboot y /api/fastapi)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3002

CMD ["nginx", "-g", "daemon off;"]
