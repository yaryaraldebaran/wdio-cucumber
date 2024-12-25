# Use Node.js 20 as the base image
FROM node:20

# Create the 'app' user and group (Debian/Ubuntu style)
RUN groupadd -r app && useradd -r -g app app

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (to take advantage of Docker caching)
COPY package*.json ./ 

# Install system dependencies (Firefox, Xvfb, and x11-utils) as root
USER root
RUN apt-get update && apt-get install -y \
    firefox-esr \
    xvfb \
    x11-utils \
    && rm -rf /var/lib/apt/lists/*

# Change ownership of package.json and package-lock.json to 'app' before installing dependencies
RUN chown app:app /app/package*.json

# Install Node.js dependencies
USER app
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Change ownership of the entire application files to the 'app' user
RUN chown -R app:app /app

# Switch to the 'app' user for runtime
USER app

# Set DISPLAY environment variable for virtual display
ENV DISPLAY=:99

# Expose port (optional, in case you have a server)
EXPOSE 3000

# Command to run Xvfb and WebDriverIO tests
CMD ["sh", "-c", "Xvfb :99 -screen 0 1280x1024x24 & npx wdio run wdio.conf.js"]
