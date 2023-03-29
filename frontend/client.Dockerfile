FROM node:18.15-alpine as builder

WORKDIR /app
COPY . .

RUN yarn

ENV NX_BASE_URL=http://192.168.1.161:8000
ENV NX_WS_URL=ws://192.168.1.161:8000

RUN npx nx build client --configuration=production --skip-nx-cache

FROM nginx:latest

COPY --from=builder /app/dist/apps/client /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]