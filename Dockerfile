# Phase 1: Build
FROM node:23-alpine AS builder

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm ci

# Copie du code source
COPY . .

# Build des assets frontend (Vite/React) + Build de l'application AdonisJS
# node ace build va automatiquement appeler vite build grâce à @adonisjs/vite
RUN node ace build

# Phase 2: Production
FROM node:23-alpine

WORKDIR /app

# Installation des dépendances de prod uniquement
COPY package*.json ./
RUN npm ci --omit=dev

# Copie du build généré vers la racine de l'application
COPY --from=builder /app/build .

# Variables d'environnement de production
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3333

EXPOSE 3333

# On lance le serveur
CMD ["node", "bin/server.js"]