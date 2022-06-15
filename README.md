# Démarrer l'application

## Lancer l'application en local

### En mode production

```bash
docker compose build
docker compose down
docker compose up
```

### En mode développement

### 1. Démarrer la BDD MySQL

```bash
cd Database
docker compose up
```

- Hôte: localhost
- Port: 3306
- Utilisateur: root
- Mot de passe: mysqlpw
- BDD: mydb

### 2. Démarrer les Microservices

#### 2.1 Accounts

```bash
cd Microservices/Accounts
npm run dev
```

- Hôte: <http://localhost:5000/>

### 3. Démarrer le Middleware

```bash
cd Middleware
npm run dev
```

- Hôte: <http://localhost:4000/>

### 4. Démarrer l'Application NextJS

- Hôte: <http://localhost:3000/>
