# Use an official Node.js runtime as a parent image (LTS version)
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
# Ensure the destination ends with a slash when using wildcards
COPY package*.json ./

# Install app dependencies using npm ci for deterministic installs
# Use --only=production if you don't need devDependencies in the final image
# However, if your start script relies on dev tools, keep them.
# Let's assume for now we might need them or the build process is simple enough.
RUN npm ci

# Copy the rest of the application source code
COPY . .

# --- Production Stage ---
# Use a smaller base image for the final stage
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy only necessary files from the builder stage
# Ensure destination directories end with a slash
COPY --from=builder /usr/src/app/node_modules ./node_modules/
COPY --from=builder /usr/src/app/package*.json ./ 
COPY --from=builder /usr/src/app/src ./src/
COPY --from=builder /usr/src/app/scripts ./scripts/
# Add other necessary directories/files if any (e.g., config, scripts used at runtime)
# COPY --from=builder /usr/src/app/config ./config/

# Make port 3000 available to the world outside this container
# Note: The PORT env variable from .env will override this if set during runtime
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
# This uses the "start" script from your package.json
CMD [ "npm", "start" ]
