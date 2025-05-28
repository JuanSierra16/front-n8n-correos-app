FROM node:18-alpine AS builder

# añadimos el build-arg
ARG VITE_API_URL
# lo convertimos a env var para que Vite lo lea
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# ahora npm run build “verá” la VITE_API_URL correcta
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]