# Générateur d'idées cadeaux (IA)

> Une application AdonisJS + Inertia + React qui génère des idées de cadeaux en s'appuyant sur des services d'IA (OpenAI ou Mistral).

**Statut**: Prototype / Démo

## Fonctionnalités

- Génération d'idées cadeaux via OpenAI ou Mistral.
- Mode démo sans clé réelle (toute clé commençant par `test` renvoie des idées fictives).
- Interface front (Inertia + React) et API REST légère (`POST /api/ideas`).

## Stack technique

- Backend: AdonisJS
- Frontend: Inertia + React

## Prérequis

- Node.js (recommandé > 18)
- Yarn ou npm

## Installation

1. Cloner le dépôt

```bash
git clone https://github.com/Captain-iiro/idea_generator-Adonisjs.git
cd idea_generator-Adonisjs
```

2. Installer les dépendances

```bash
npm install
# ou
# yarn install
```

3. Copier le fichier d'environnement et ajuster les variables

Copiez l'exemple et ajustez les valeurs (important : `APP_KEY` doit être défini pour éviter l'erreur `EnvValidationException`):

```bash
# Copier l'exemple en .env
cp .env.example .env

# (Optionnel) ou en local
cp .env.example .env.local
```

Générer une `APP_KEY` sécurisée (exemples) :

```bash
# Avec OpenSSL
openssl rand -base64 32

# Ou (si Node supporte require) :
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Collez la clé générée dans la variable `APP_KEY` du fichier `.env`.

Note: Si vous lancez `node build/bin/server.js` (mode production), assurez-vous que les variables d'environnement requises sont disponibles dans l'environnement d'exécution ou que le fichier `.env` existe à la racine du projet. L'absence de `APP_KEY`, `DB_USER`, `DB_DATABASE`, etc. provoquera des erreurs `EnvValidationException` comme celles que vous avez vues.

## Lancement en développement

```bash
npm run dev
```

Visitez `http://localhost:3333` pour l'interface Inertia.

## Commandes utiles

- `npm run dev` : Démarrer le serveur en mode développement (HM R)
- `npm run build` : Construire le projet
- `npm start` : Démarrer le serveur en production (`node bin/server.js`)
- `npm run test` : Lancer les tests
- `npm run lint` : Lancer ESLint
- `npm run format` : Formater le code avec Prettier
- `npm run typecheck` : Vérifier les types TypeScript

## API

Endpoint principal pour la génération d'idées :

- `POST /api/ideas`

Payload attendu (JSON):

```json
{
  "age": 30,
  "tastes": "cuisine, voyage, photo",
  "apiKey": "test-demo-or-real-key",
  "provider": "openai" // ou "mistral"
}
```

Réponse (succès):

```json
{
  "success": true,
  "data": {
    "ideas": ["Idée 1", "Idée 2", "Idée 3", "Idée 4", "Idée 5"],
    "provider": "openai",
    "timestamp": "2025-12-05T12:00:00.000Z"
  }
}
```

Réponse (erreur):

```json
{
  "success": false,
  "error": "Message d'erreur descriptif"
}
```

## Déploiement

- Construisez l'application : `npm run build`
- Démarrez avec `npm start` ou via votre process manager préféré (PM2, systemd, Docker, etc.)

## Contribution

Contributions bienvenues — ouvrez une issue ou une PR. Respectez le format du code et lancez `npm run format` avant de proposer des modifications.
