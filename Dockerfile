FROM node:18-alpine
WORKDIR /app

# instala deps del backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# instala deps del frontend y buildea
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# copia el resto del proyecto
COPY . .

EXPOSE 3000
CMD ["node", "backend/src/index.js"]
