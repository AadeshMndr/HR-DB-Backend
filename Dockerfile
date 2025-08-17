
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package files first (better caching)
COPY package.json package-lock.json* ./

# Install dependencies (respect lockfile if present)
RUN npm install

# Copy rest of the application
COPY . .

# Expose backend port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]

# FROM node:18-alpine

# # Install pnpm
# RUN npm install -g pnpm

# # Set working directory
# WORKDIR /app

# # Copy package files
# COPY package.json pnpm-lock.yaml ./

# # Install dependencies
# RUN pnpm install

# # Copy application code
# COPY . .

# # Expose port
# EXPOSE 5000

# # Start the application
# CMD ["pnpm", "run", "start"]
