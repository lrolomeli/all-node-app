# Etapa de compilación (Usa el vite.config.js)
FROM node:18-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de servidor (Usa Nginx)
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
# IMPORTANTE: Aquí sobreescribimos la config por defecto de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]