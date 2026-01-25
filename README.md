# TEXTORIA - Plateforme de Génération de Contenu AI

## 🚀 Vue d'ensemble

TEXTORIA est une plateforme moderne de génération de contenu utilisant l'intelligence artificielle pour créer du texte et des images. Le projet utilise une architecture full-stack avec Next.js pour le frontend et Express.js pour le backend.

## 📁 Structure du Projet

```
TEXTORIA/
├── client/                 # Frontend Next.js
│   ├── app/               # Pages et composants
│   ├── contexts/          # Contextes React
│   ├── config/            # Configuration API
│   └── ...
├── server/                # Backend Express.js
│   ├── routes/            # Routes API
│   ├── middleware/        # Middlewares
│   ├── prisma/            # Schéma de base de données
│   └── ...
└── docs/                  # Documentation
    ├── SETUP.md           # Guide d'installation
    └── ENV_SETUP_GUIDE.md # Configuration environnement
```

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Zustand** - Gestion d'état
- **Framer Motion** - Animations

### Backend
- **Express.js** - Framework Node.js
- **Prisma** - ORM pour PostgreSQL
- **Passport.js** - Authentification
- **Stripe** - Paiements
- **OpenAI/Google AI** - Services AI

## 🚀 Installation Rapide

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd TEXTORIA
   ```

2. **Installer les dépendances**
   ```bash
   # Frontend
   cd client
   npm install
   
   # Backend
   cd ../server
   npm install
   ```

3. **Configuration de l'environnement**
   ```bash
   # Copier les fichiers d'exemple
   cp server/env.example server/.env
   cp client/.env.example client/.env.local
   ```

4. **Base de données**
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   ```

5. **Démarrer les serveurs**
   ```bash
   # Backend (port 5000)
   cd server
   npm run dev
   
   # Frontend (port 3000)
   cd client
   npm run dev
   ```

## 📚 Documentation

- [Guide d'Installation Complet](docs/SETUP.md)
- [Configuration Environnement](docs/ENV_SETUP_GUIDE.md)
- [Guide d'Intégration](docs/INTEGRATION_COMPLETE.md)

## 🔧 Scripts Utiles

### Backend
```bash
npm run dev          # Développement avec nodemon
npm run build        # Générer Prisma client
npm run db:setup     # Configuration base de données
npm run create-admin # Créer un utilisateur admin
```

### Frontend
```bash
npm run dev          # Développement
npm run build        # Build de production
npm run start        # Démarrer en production
```

## 🌐 Déploiement

- **Frontend** : Vercel
- **Backend** : Railway/Render
- **Base de données** : PostgreSQL

## 📄 Licence

ISC

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request
