FROM golang:1.20-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

ENV GIN_MODE=release

RUN go build -o main .

EXPOSE 8000

CMD ["./main"]