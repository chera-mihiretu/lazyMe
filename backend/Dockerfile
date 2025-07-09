# Start from the official Golang image
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install git for go mod download if needed
RUN apk add --no-cache git

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the Go app
RUN go build -o main ./delivery/

# Use a minimal image for running
FROM alpine:latest
WORKDIR /app

# Copy the built binary from builder
COPY --from=builder /app/main .
# Copy .env if you want it available (optional, for debugging)
COPY .env .

# Expose the port your app runs on
EXPOSE 8080

# Run the binary
CMD ["./main"]
