FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better build caching)
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the server code
COPY . .

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
