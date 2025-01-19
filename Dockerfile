# Use an official Node.js runtime as the base.
# The '-slim' variants have fewer packages, so we explicitly install what we need.
FROM node:20-slim

# Install dependencies required by Chromium and Puppeteer.
# This list covers most common Chromium libs. Adjust as necessary.
RUN apt-get update && apt-get install -y \
    chromium \
    libatk-bridge2.0-0 \
    libasound2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpangocairo-1.0-0 \
    fonts-liberation \
    xdg-utils \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxfixes3 \
    libxi6 \
    libxinerama1 \
    libxcursor1 \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# 1) Skip Puppeteer’s own Chromium download
# 2) Set production mode if desired
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    NODE_ENV=production

# Install Node dependencies
RUN npm install --omit=dev

# Copy the rest of your app's code into the container
COPY . .

# EXPOSE is just documentation; not strictly necessary for Railway
EXPOSE 5000

# Run the server
CMD ["npm", "start"]
