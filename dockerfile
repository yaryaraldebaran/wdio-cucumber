# Use Node.js 20 as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install Firefox in the container
RUN apt-get update && apt-get install -y firefox-esr

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port (optional, in case you have a server)
EXPOSE 3000

# Command to run your tests (adjust as needed)
CMD ["npx", "wdio", "run", "wdio.conf.js"]
