# FROM node:20-alpine AS deps
# WORKDIR /app
# RUN apk add --no-cache libc6-compat
# COPY package.json package-lock.json ./
# RUN npm ci

# FROM node:20-alpine AS builder
# WORKDIR /app

# ENV NEXT_PUBLIC_API_URL=http://backend:8000

# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# RUN npm run build

# FROM node:20-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV=production

# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/node_modules ./node_modules

# EXPOSE 3000
# CMD ["npm", "start"]
# ---------- deps ----------
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
# se você usa npm:
RUN npm ci

# ---------- builder ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# (1) Recebe variáveis no build
ARG API_URL
ARG NEXT_PUBLIC_API_URL

# (2) Exporta para o processo do build (next build precisa disso)
ENV API_URL=${API_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

# ---------- runner ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Mantém as variáveis também em runtime
ENV API_URL=${API_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Se você usa "next start"
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "run", "start"]