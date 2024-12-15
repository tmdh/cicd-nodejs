# Documentation: Setting Up Node.js App with Docker and CI/CD Pipeline

### 1. Node.js Project Setup
Initialize a new Node.js project:

```bash
    mkdir Node-App-CICD
    cd Node-App-CICD
    npm init -y

```

Install necessary dependencies:
```bash
    npm install express
```

Create a basic server.js file:
```bash
    const express = require('express');
    const app = express();
    const PORT = 3000;

    app.get('/', (req, res) => {
      res.send('Hello, World!');
    });
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

```

2. Dockerfile Creation

```bash
    # Use the official Node.js image
    FROM node:18-alpine
    
    # Set working directory
    WORKDIR /app
    
    # Copy package.json and package-lock.json
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    # Copy application code
    COPY . .
    
    # Expose the port
    EXPOSE 3000
    
    # Command to run the application
    CMD ["node", "server.js"]

```

Create a docker-compose.yml file:

```bash
    services:
      node-app:
        build:
          context: .
          dockerfile: Dockerfile
        ports:
          - "3000:3000"
        volumes:
          - .:/app
          - /app/node_modules
        environment:
          - NODE_ENV=development

```
Create a .github/workflows/ci-cd-pipeline.yml file:

```bash
    name: CI/CD Pipeline

    on:
      push:
        branches:
          - main
    
    jobs:
      test:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout code
            uses: actions/checkout@v3
    
          - name: Setup Node.js
            uses: actions/setup-node@v3
            with:
              node-version: 18
    
          - name: Install dependencies
            run: npm install
    
          - name: Run tests
            run: npm test
    
      build_and_push:
        runs-on: ubuntu-latest
        needs: test
        steps:
          - name: Checkout code
            uses: actions/checkout@v3
    
          - name: Log in to DockerHub
            uses: docker/login-action@v2
            with:
              username: ${{ secrets.DOCKER_USERNAME }}
              password: ${{ secrets.DOCKER_PASSWORD }}
    
          - name: Build Docker Image
            run: |
              docker build -t ${{ secrets.DOCKER_USERNAME }}/node-app:latest .
    
          - name: Push Docker Image to DockerHub
            run: |
              docker push ${{ secrets.DOCKER_USERNAME }}/node-app:latest
    
      deploy_staging:
        runs-on: self-hosted
        needs: build_and_push
        steps:
          - name: SSH into staging server and deploy
            uses: appleboy/ssh-action@v0.1.6
            with:
              host: ${{ secrets.STAGING_SERVER_HOST }}
              username: ${{ secrets.STAGING_SERVER_USER }}
              password: ${{ secrets.STAGING_SERVER_PASSWORD }}
              script: |
                cd /path/to/your/project
                docker-compose pull
                docker-compose up -d --build


```

### Secrets Configuration in GitHub
Add DockerHub credentials (DOCKER_USERNAME, DOCKER_PASSWORD) and staging server credentials (STAGING_SERVER_HOST, STAGING_SERVER_USER, STAGING_SERVER_PASSWORD) as secrets in your GitHub repository settings.

