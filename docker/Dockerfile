# Build
FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN yes N | npm install

# Copy only the file needed for Angular build
COPY *.json .
COPY .browserslistrc .
COPY src ./src

RUN npm run build-prod

### STAGE 2: Run ###
FROM nginx:1.19.4-alpine

COPY docker/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /usr/src/app/dist/project /usr/share/nginx/html
