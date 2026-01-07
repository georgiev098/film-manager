FROM golang:1.25-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git

# Install Air (hot reload tool)
RUN go install github.com/air-verse/air@latest

# Preload Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

EXPOSE 8080

# Start Air
CMD ["air"]
