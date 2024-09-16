# Stage 1: Build the React app (frontend)
FROM node:18 AS frontend-builder

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy frontend dependencies and install them
COPY ./src/package.json ./src/package-lock.json ./
RUN npm install

# Copy all other frontend files
COPY ./src .

# Build the React app
RUN npm run build

# Stage 2: Python FastAPI backend
FROM python:3.9-slim

# Set working directory for the backend
WORKDIR /app

# Copy the backend code
COPY ./backend /app/backend

# Copy the model files
COPY ./model /app/model

# Copy the built React app from the first stage
COPY --from=frontend-builder /app/frontend/build /app/frontend/build

# Install Python dependencies
COPY ./requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt

# Expose port 8000 for the main FastAPI app
EXPOSE 8000

# Expose port 8001 for the authentication FastAPI app
EXPOSE 8001

# Start both FastAPI servers (main app and auth app)
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port 8000 & uvicorn backend.auth:auth_app --host 0.0.0.0 --port 8001"]
