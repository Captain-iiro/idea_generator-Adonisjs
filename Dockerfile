# Phase 1: Build
FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Cette commande compile le TS ET lance 'vite build' automatiquement
RUN node ace build

# Phase 2: Production
FROM node:23-alpine

WORKDIR /app

# On copie tout le dossier build
COPY --from=builder /app/build ./build
# IMPORTANT : On copie aussi les fichiers statiques compilés pour le front
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev

# Adonis a besoin de savoir qu'il est en prod pour chercher le manifest.json
ENV NODE_ENV=production

EXPOSE 3333

CMD ["node", "build/bin/server.js"]