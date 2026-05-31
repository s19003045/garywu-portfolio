# syntax=docker/dockerfile:1

# Multi-stage build for the Next.js 16 portfolio, using `output: 'standalone'`
# (set in next.config.ts) to produce a minimal production image.

# ─── deps: install dependencies (incl. dev deps, needed for `next build`) ───
FROM node:20-alpine AS deps
# Next.js on Alpine needs the glibc compat shim for some native modules.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
# puppeteer is a devDependency used only by the offline `resume:pdf` script —
# skip its ~150 MB Chromium download during the image build.
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN --mount=type=cache,target=/root/.npm npm ci

# ─── builder: compile the app ───
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# `next build` fetches Google Fonts (next/font) at build time — the build host
# needs outbound network access. Fonts are then self-hosted in .next/static.
RUN npm run build

# ─── runner: minimal production runtime ───
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as an unprivileged user.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# The standalone server bundle (includes a trimmed node_modules + server.js).
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static assets & public files (not included in the standalone bundle).
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# MDX content — defensive: case-study/blog slugs are SSG (baked at build), but
# this keeps runtime reads (lib/mdx uses process.cwd()) working if any page
# later becomes dynamic. Tiny footprint.
COPY --from=builder --chown=nextjs:nodejs /app/content ./content

USER nextjs
EXPOSE 3000

# server.js is emitted by `output: 'standalone'`; honours PORT / HOSTNAME.
CMD ["node", "server.js"]
