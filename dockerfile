# Use Node.js 20 as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install Firefox, Xvfb, and x11-utils (for verifying Xvfb)
RUN apt-get update && apt-get install -y \
    firefox-esr \
    xvfb \
    x11-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set DISPLAY environment variable for virtual display
ENV DISPLAY=:99

# Expose port (optional, in case you have a server)
EXPOSE 3000

# Command to run Xvfb and WebDriverIO tests
CMD ["sh", "-c", "Xvfb :99 -screen 0 1280x1024x24 & npx wdio run wdio.conf.js"]
