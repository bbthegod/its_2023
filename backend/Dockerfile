FROM golang:1.20-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

ENV GIN_MODE=release
ENV PORT=8000
ENV DB_URL=mongodb://mongo:27017/itsupporter
ENV DB_NAME=itsupporter
ENV JWT_SECRET=secret

RUN go build -o main ./cmd/app/main.go

EXPOSE 8000

CMD ["./main"]