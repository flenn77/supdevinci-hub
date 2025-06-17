# Utilise Node.js en version 18 légère
FROM node:18-alpine

# Crée et positionne le répertoire de travail
WORKDIR /usr/src/app

# Copie package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le code source
COPY . .

# Expose le port du serveur de dev Vite
EXPOSE 5173

# Commande de démarrage en mode développement
CMD ["npm", "run", "dev"]
