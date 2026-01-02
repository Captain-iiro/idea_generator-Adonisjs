# Utilisation de la version la plus récente de Node sur Alpine
FROM node:23-alpine AS builder

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm ci

# Copie du code et build de l'application Adonis
COPY . .
RUN node ace build

# Phase finale de production
FROM node:23-alpine

WORKDIR /app

# Copie des fichiers compilés
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# Installation des dépendances de prod uniquement
RUN npm ci --omit=dev

# On expose le port standard d'Adonis
EXPOSE 3333

# Commande de démarrage
CMD ["node", "build/bin/server.js"]