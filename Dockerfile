# Phase 1: Build
FROM node:23-alpine AS builder

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm ci

# Copie du code source
COPY . .

# Build de l'application (génère le dossier ./build)
RUN node ace build

# Phase 2: Production
FROM node:23-alpine

WORKDIR /app

# On copie TOUT le contenu du dossier build généré
# Le dossier build d'Adonis contient déjà : /bin, /public, /config, etc.
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# Installation des dépendances de prod uniquement
RUN npm ci --omit=dev

# Variables d'environnement de production
ENV NODE_ENV=production
# On s'assure que l'app écoute sur toutes les interfaces réseau du conteneur
ENV HOST=0.0.0.0 

EXPOSE 3333

# On lance le serveur depuis le dossier build
CMD ["node", "build/bin/server.js"]