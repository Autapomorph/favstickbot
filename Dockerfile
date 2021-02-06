FROM node:14-alpine as base
RUN apk add --no-cache git
RUN npm config set unsafe-perm true
WORKDIR /usr/src/app
COPY package*.json ./

FROM base as prod
RUN npm ci --only=prod
COPY . .
CMD ["npm", "start"]

FROM base as dev
COPY --from=prod /usr/src/app .
RUN npm install --only=dev
CMD ["npm", "run", "dev", "--", "--", "--legacy-watch"]
