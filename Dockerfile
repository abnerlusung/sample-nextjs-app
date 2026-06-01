FROM registry.access.redhat.com/ubi8/ubi-minimal:8.10-1779857793

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN microdnf module enable nodejs:20 -y \
  && microdnf install nodejs npm -y \
  && microdnf clean all

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build \
  && npm prune --omit=dev

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
