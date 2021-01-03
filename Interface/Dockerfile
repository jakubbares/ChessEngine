FROM node:15.5.0-alpine as builder

ADD package.json package-lock.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build

RUN npm i && mkdir /ng-app && cp -R ./node_modules ./ng-app

RUN npm install -g @angular/cli@11.0.4

ADD . /ng-app

WORKDIR /ng-app

ENV PATH /ng-app/node_modules/.bin:$PATH

# generate build
RUN ng build --output-path=dist --prod

############
### prod ###
############

# base image
FROM nginx:1.16.0-alpine

# copy artifact build from the 'build environment'
COPY --from=builder /ng-app/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
