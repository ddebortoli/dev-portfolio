# Etapa 1: Build de React
FROM node:18-bullseye AS build

# Directorio de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias con legacy-peer-deps para evitar conflictos
RUN npm install --legacy-peer-deps

# Copiamos el resto del proyecto
COPY . .

# Evitamos error de OpenSSL en Node 18+
ENV NODE_OPTIONS=--openssl-legacy-provider

# Build de producción
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:stable

# Copiamos el build de React al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
