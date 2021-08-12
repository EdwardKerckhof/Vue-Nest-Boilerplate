# Yarn Monorepo

Yarn monorepo including:

- packages/common: common variables/functions used withing other packages
- packages/api: NestJS api with JWT (cookie-based) authentication and role-based authorization
- packages/app: Vue 3 (Vite) TypeScript app to communicate with api

## Vue-Nest-Boilerplate

Dockerized NestJS and Vue 3 applications including user authentication with JWT and cookies + role-based authorization

### You need

- NPM
- Docker

### Start the app

Before running any docker commands make sure you create a .env file at the root of your directory containing all the keys from `.env.example`

Information:

- Database can be accesses via PG-Admin at the URL `http://localhost:5050`
- API can be accesses at the URL `http://localhost:3000/api`
- Vue APP can be accesses at the URL `http://localhost:4200`

Easiest way: Using docker-compose

```bash
docker-compose u
```

--- Or ---

Build your image:  
`docker build -t <<user>/project-name> <path to Dockerfile>`

Run your image:  
`docker run -p 3000:3000 -p 4200:4200 -e DATABASE_URL=<your database URL> DATABASE_ADMIN_EMAIL=<admin email> JWT_SECRET=<secret> <<user>/project-name>`

For Example:  
`docker build -t edwardkerckhof/nest-docker-api .`  
`docker run -p 3000:3000 -p 4200:4200 -e DATABASE_URL=db://user:password@db:PORT/database_name DATABASE_ADMIN_EMAIL=email@gmail.com JWT_SECRET=mysupersecret edwardkerckhof/nest-docker-api`

--- Or if you don't have docker ---

Have a postgres database running, fill in the environment variables in your .env files and run each package separately.
