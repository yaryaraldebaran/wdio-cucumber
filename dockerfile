# Use Node.js 20 as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install Firefox in the container
# Install Xvfb untuk mendukung mode headless di Docker
RUN apt-get update && apt-get install -y firefox-esr xvfb

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set DISPLAY environment variable untuk menggunakan virtual display
ENV DISPLAY=:99

# Expose port (optional, in case you have a server)
EXPOSE 3000

# Command to run Xvfb and WebDriverIO tests
CMD sh -c "Xvfb :99 -screen 0 1280x1024x24 & npx wdio run wdio.conf.js"


# Command to run your tests (adjust as needed)
# CMD ["npx", "wdio", "run", "wdio.conf.js"]
