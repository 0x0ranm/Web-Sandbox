FROM --platform=linux/amd64 node:16

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update
RUN apt --fix-broken install
RUN apt-get install google-chrome-stable -y

# Create app directory
WORKDIR /usr/src/app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Install app dependencies
COPY package*.json ./
RUN npm install
RUN npm install puppeteer
COPY ./ .
COPY cert.pem /usr/src/app/cert.pem
COPY key.pem /usr/src/app/key.pem

EXPOSE 8888
CMD [ "node", "app.js" ]