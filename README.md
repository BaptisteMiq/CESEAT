# Application CESEAT

## Démarrer l'application

### Lancer l'application en mode développement

```bash
./start.dev.sh
```

### Lancer l'application en mode production

```bash
./start.prod.sh
```

## Ports utilisés par l'application

| Port | Service |
| ---- | ------ |
| 5100 | Microservice Accounts |
| 3100 | Microservice CDN |
| 4600 | Microservice Orders |
| 4700 | Microservice Sockets |
| 3000 | Application Next.JS |
| 3306 | Serveur MySQL |
| 4000 | Middleware (Serveur GraphQL) |

# Documentation de l'API

```Documentation API.pdf```

# Requis et recommandations

Pour faire fonctionner l'application, la machine hôte doit avoir **au minimum** les services suivants :

- CPU 4 Core
- 8GB de RAM
- 32 GB de stockage

