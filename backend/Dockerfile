FROM node:18-alpine
WORKDIR /app
# Instalamos solo dependencias de producción
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "src/index.js"]