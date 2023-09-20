FROM node:18.15-alpine as builder

WORKDIR /app
COPY . .

RUN yarn

ENV NX_IMAGE_SERVICE_URL=http://192.168.1.162:9000
ENV NX_BASE_URL=http://192.168.1.162:8000
ENV NX_WS_URL=ws://192.168.1.162:8000

RUN npx nx build admin --configuration=production --skip-nx-cache

FROM nginx:latest

COPY --from=builder /app/dist/apps/admin /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]