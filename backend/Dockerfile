# Utilise Node.js en version 18 légère
FROM node:18-alpine

# Crée et positionne le répertoire de travail
WORKDIR /usr/src/app

# Copie package.json et package-lock.json (s’ils existent) pour installer uniquement les dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le code source
COPY . .

# Expose le port de l’API
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "run", "start"]
