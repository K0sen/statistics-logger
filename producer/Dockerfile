FROM node:14.2.0-stretch
COPY package.json package-lock.json ./app/
WORKDIR /app
RUN npm install
EXPOSE 3000
CMD npm start