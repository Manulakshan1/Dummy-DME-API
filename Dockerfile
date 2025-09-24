# Use Node.js LTS
FROM node:22-alpine

# Create app directory inside container
WORKDIR /usr/src/app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port (matches your .env PORT=4000)
EXPOSE 4000

# Start the backend
CMD ["npm", "start"]
