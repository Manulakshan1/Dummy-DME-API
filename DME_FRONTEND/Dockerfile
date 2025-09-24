# Use Nginx to serve static files
FROM nginx:alpine

# Copy frontend files into Nginx web root
COPY . /usr/share/nginx/html

# Expose port 3000 for frontend
EXPOSE 3000

# Override default Nginx config to use port 3000
RUN sed -i 's/listen       80;/listen 3000;/' /etc/nginx/conf.d/default.conf
