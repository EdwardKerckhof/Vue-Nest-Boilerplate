#################
## DEVELOPMENT ##
#################
# build node image for development
FROM node:14 AS development

# specify working directory
WORKDIR /usr/src/api

# copy both package.json and .lock files
COPY package*.json ./
COPY yarn.lock ./

# install dependencies
RUN yarn install

# copy all other files
COPY . .

# build the api
RUN yarn build

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
WORKDIR /usr/src/api

# copy all from development stage
COPY --from=development /usr/src/api .

# expose port that api uses
EXPOSE 3000

# run the compiled code
CMD [ "node", "dist/main" ]