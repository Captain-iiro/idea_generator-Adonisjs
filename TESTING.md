# 🎮 Guide de Test Rapide - Mode Démo

## Étapes pour tester l'application

### 1. Ouvrez l'application

Allez sur : **http://localhost:3333**

### 2. Remplissez le formulaire

| Champ                 | Valeur                      |
| --------------------- | --------------------------- |
| **Âge**               | `25`                        |
| **Goûts et intérêts** | `gaming, technology, music` |
| **Clé API**           | Cliquez sur **"Mode démo"** |
| **Fournisseur IA**    | `OpenAI (GPT-3.5)`          |

### 3. Générez les idées

Cliquez sur le bouton **"✨ Générer des idées"**

### 4. Résultat attendu

Vous devriez voir 5 idées cadeaux comme :

- Drone 4K DJI
- Enceinte portable JBL
- Cafetière connectée SCAA
- Barre de son Sonos
- Smartwatch premium

Le provider affiché sera : **openai (DEMO)**

---

## 🔧 Test via ligne de commande

Si vous préférez tester via cURL :

```bash
curl -X POST http://localhost:3333/api/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "age": 25,
    "tastes": "gaming, technology, music",
    "apiKey": "test-demo",
    "provider": "openai"
  }'
```

---

## ❌ Résolution de l'erreur de quota

Si vous voyez :

```
Quota OpenAI épuisé. Ajoutez des crédits...
```

**C'est parce que vous avez utilisé une vraie clé OpenAI sans crédits.**

**Solution** : Utilisez le mode démo en cliquant sur "Mode démo" dans le formulaire !
