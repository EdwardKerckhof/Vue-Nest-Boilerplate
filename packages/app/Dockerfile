#################
## DEVELOPMENT ##
#################
# build node image for development
FROM node:14 AS development

# specify working directory
WORKDIR /usr/src/app

# copy both package.json and .lock files
COPY package*.json ./
COPY yarn.lock ./

# install dependencies
RUN yarn install

# copy all other files
COPY . .

################
## PRODUCTION ##
################
# build another node image for production
FROM node:14 AS production

# set node env to production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# set other needed environment variables

# specify working directory
WORKDIR /usr/src/app

# copy all from development stage
COPY --from=development /usr/src/app .

# expose port that api uses
EXPOSE 4200

# run the compiled code
CMD [ "yarn", "dev" ]