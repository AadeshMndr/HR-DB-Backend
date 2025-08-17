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
