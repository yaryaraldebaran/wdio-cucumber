# Use Node.js 20 as the base image
FROM node:20

# Create the 'app' user and group (Debian/Ubuntu style)
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

# Change ownership of the /app directory to the 'app' user
RUN chown -R app:app /app

# Switch to the 'app' user for runtime
USER app

# Install Node.js dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Change ownership of the entire application files to the 'app' user
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
