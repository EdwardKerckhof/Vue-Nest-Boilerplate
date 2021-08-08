
################
## PRODUCTION ##
################
FROM node:14

# specify working directory
WORKDIR /usr/src/bp

# copy both package.json and .lock file
COPY package.json ./
COPY yarn.lock ./

# copy both package.json and .lock file from all the packages
COPY packages/api/package.json ./packages/api/
COPY packages/api/yarn.lock ./packages/api/
COPY packages/app/package.json ./packages/app/
COPY packages/app/yarn.lock ./packages/app/
COPY packages/common/package.json ./packages/common/

# install dependencies
RUN yarn install

# copy all other files
COPY packages/api/dist ./packages/api/dist
COPY packages/app/dist ./packages/app/dist
COPY packages/common/dist ./packages/common/dist

# set node env to production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# set other needed environment variables
ENV DATABASE_URL=${DATABASE_URL}
ENV DATABASE_ADMIN_EMAIL=${DATABASE_ADMIN_EMAIL}
ENV JWT_SECRET=${JWT_SECRET}

# expose ports that api and app use
EXPOSE 3000
EXPOSE 4200

CMD ["npm", "start"]