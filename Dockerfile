############
## COMMON ##
############
# build node image for development
FROM node:14 AS common

# specify working directory
WORKDIR /usr/src/bp

# copy both package.json and .lock file
COPY package.json ./
COPY yarn.lock ./

# copy both package.json and .lock file from all the packages
COPY packages/common/package.json ./packages/common/

# install dependencies
RUN yarn install

# copy all other files
COPY . . 

#########
## API ##
#########
# build node image for development
FROM node:14 AS api

# specify working directory
WORKDIR /usr/src/bp

# copy both package.json and .lock file
COPY package.json ./
COPY yarn.lock ./

# copy both package.json and .lock file from all the packages
COPY packages/api/package.json ./packages/api/
COPY packages/api/yarn.lock ./packages/api/

# install dependencies
RUN yarn install

# copy all other files
COPY --from=common /usr/src/bp .

#########
## APP ##
#########
# build node image for development
FROM node:14 AS app

# specify working directory
WORKDIR /usr/src/bp

# copy both package.json and .lock file
COPY package.json ./
COPY yarn.lock ./

# copy both package.json and .lock file from all the packages
COPY packages/app/package.json ./packages/app/
COPY packages/app/yarn.lock ./packages/app/

# install dependencies
RUN yarn install

# copy all other files
COPY --from=api /usr/src/bp .

################
## PRODUCTION ##
################
# build another node image for production
FROM node:14 AS production

# set node env to production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# set other needed environment variables
ENV DATABASE_URL=${DATABASE_URL}
ENV DATABASE_ADMIN_EMAIL=${DATABASE_ADMIN_EMAIL}
ENV JWT_SECRET=${JWT_SECRET}

# specify working directory
WORKDIR /usr/src/bp

# copy all from development stage
COPY --from=app /usr/src/bp .

# expose ports that api and app use
EXPOSE 3000
EXPOSE 4200

CMD ["npm", "start"]