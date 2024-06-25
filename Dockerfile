# Stage 1: Build the application
FROM node:18-alpine as builder
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create the production image
FROM node:18-alpine as prod

COPY --from=builder /app/.husky /.husky

COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/dist ./

# Install dependencies, including husky
RUN npm install

# Expose port 5000
EXPOSE 5000

# Set the entrypoint
ENTRYPOINT ["node", "index.js"]
