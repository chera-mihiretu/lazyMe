FROM golang:1.24.0-bookworm AS go-builder

WORKDIR /app/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download || go mod download || go mod download
COPY backend/ .
RUN go build -o main ./delivery/

FROM node:20.19.0-bookworm-slim AS web-builder

WORKDIR /app/web
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web/ .
RUN npm run build

FROM python:3.11.12-slim-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY text_extractor/requirements.txt /app/text_extractor/requirements.txt
RUN pip install --no-cache-dir --timeout=300 --retries=5 -r /app/text_extractor/requirements.txt

COPY . .

COPY --from=go-builder /app/backend/main /app/backend/main
COPY --from=web-builder /app/web/.next /app/web/.next
COPY --from=web-builder /app/web/node_modules /app/web/node_modules

CMD ["bash"]
