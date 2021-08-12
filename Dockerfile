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
COPY packages/api/package.json ./packages/api/
COPY packages/api/yarn.lock ./packages/api/
COPY packages/app/package.json ./packages/app/
COPY packages/app/yarn.lock ./packages/app/

# install dependencies
RUN yarn install

# copy all other files
# COPY . .

##########
## PROD ##
##########
# build node image for development
FROM node:14 AS prod

# specify working directory
WORKDIR /usr/src/bp

# copy all other files
COPY packages/common/dist ./packages/common/dist
COPY packages/api/dist ./packages/api/dist
COPY packages/app/dist ./packages/app/dist

# copy all other files
COPY --from=common /usr/src/bp .

#########
## ENV ##
#########
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