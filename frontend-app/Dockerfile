# Stage 1: Build the Angular application
FROM node:20 AS build

WORKDIR /app

# Copy package configuration files
COPY package.json package-lock.json ./

# Install dependencies
# Using --legacy-peer-deps might be needed depending on Angular/dependency versions
RUN npm install --legacy-peer-deps

# Copy the rest of the application source code
COPY . .

# Build the application for production
# Output path is defined in angular.json as dist/frontend-app
RUN npm run build -- --configuration production --output-path=./dist/frontend-app

# Stage 2: Serve the application from Nginx
FROM nginx:alpine

# Argument to accept Node ID
ARG NODE_ID=unknown-node

# Set environment variable for Node ID
ENV NODE_ID=${NODE_ID}

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy the built application artifacts from the 'build' stage
# Copy the entire contents of the build output directory
COPY --from=build /app/dist/frontend-app /usr/share/nginx/html

# Install gettext package which provides envsubst
RUN apk update && apk add --no-cache gettext

# Copy custom Nginx configuration as a template to be processed by envsubst
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Expose port 80
EXPOSE 80

# Process the Nginx config template and start Nginx
# This substitutes only the specified environment variables (like $NODE_ID) into the config, leaving Nginx variables ($host, $uri etc.) untouched.
CMD sh -c "envsubst '\$NODE_ID' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
