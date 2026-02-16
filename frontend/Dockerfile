FROM node:25-alpine

WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Vite's default port
EXPOSE 5173

# The command is actually handled by docker-compose, 
# but it's good practice to include a default here.
CMD ["npm", "run", "dev", "--", "--host"]