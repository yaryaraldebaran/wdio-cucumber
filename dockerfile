# Use Node.js 20 as the base image
FROM node:20

# Create a user and group 'app'
RUN groupadd -r app && useradd -r -g app -m app

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies (Firefox, Xvfb, and x11-utils) as root
USER root
RUN apt-get update && apt-get install -y \
    firefox-esr \
    xvfb \
    x11-utils \
    && rm -rf /var/lib/apt/lists/*

# Set the npm cache directory and set a writable home directory for the 'app' user
RUN mkdir -p /app/.npm-cache
ENV HOME=/app

# Copy package.json and package-lock.json first (to take advantage of Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . /app

# Change ownership of the package files to the 'app' user
RUN chown -R app:app /app

# Debug step: List the contents of /app to check file ownership
RUN ls -l /app

# Debug step: Check which user is running the commands
RUN whoami

# Install Node.js dependencies with legacy peer deps
USER app
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Ensure the 'app' user has access to the application files
USER root
RUN chown -R app:app /app

# Switch back to the 'app' user for runtime
USER app

# Set DISPLAY environment variable for virtual display
ENV DISPLAY=:99

# Expose port (optional, in case you have a server)
EXPOSE 3000

# Command to run Xvfb and WebDriverIO tests
CMD ["sh", "-c", "Xvfb :99 -screen 0 1280x1024x24 & npx wdio run wdio.conf.js"]
