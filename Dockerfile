FROM node:18-alpine

WORKDIR /api

COPY package*.json ./

RUN npm install pm2 -g 
RUN npm install

COPY . .

RUN npm run build

# Debug: Mostrar o conteúdo do package.json
RUN cat package.json >> /tmp/debug_output.txt

COPY .env ./.env

EXPOSE 3001

# Use pm2-runtime para manter o container rodando
CMD ["pm2-runtime", "start", "dist/server.js", "--name", "backend"]