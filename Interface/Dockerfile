FROM node:15.5.0-alpine as builder

ADD package.json package-lock.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build

RUN npm i && mkdir /ng-app && cp -R ./node_modules ./ng-app

ADD . /ng-app

WORKDIR /ng-app


## Build the angular app in production mode and store the artifacts in dist folder
RUN $(npm bin)/ng build --prod

CMD ng serve --host 0.0.0.0
