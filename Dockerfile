FROM node:20.11.0

WORKDIR /app

COPY package*.json ./

RUN npm install

# 👉 Copia el archivo .env
COPY .env ./

# Copia tu código fuente
COPY ./src ./src

EXPOSE 3000

CMD ["npm", "start"]
