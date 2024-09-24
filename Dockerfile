# Use an official Node.js runtime as the base image
FROM node:20-alpine as build-stage 

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Copy the application files to the container
COPY . .

# Install dependencies
RUN npm install

# Expose the port that your application listens on (e.g., 3000)
EXPOSE 8000

# Create an entry point script to start your application
CMD [ "npm", "run","start" ]