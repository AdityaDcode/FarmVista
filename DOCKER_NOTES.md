# Docker Configuration - Comprehensive Notes

## Overview
FarmVista uses Docker to containerize both the frontend (React + Vite) and backend (Node.js + Express) applications. Each component has its own optimized Dockerfile following best practices for production-ready images.

---

## **1. SERVER DOCKERFILE ANALYSIS**

### File Location
`server/Dockerfile`

### Source Code
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
```

### Line-by-Line Explanation

#### `FROM node:20-alpine`
**What:** Base image specification  
**Why Alpine:**
- ✅ Lightweight (~150MB vs 900MB for node:20-slim)
- ✅ Small footprint reduces image size, pull time, and startup time
- ✅ Alpine Linux is minimal but includes essential tools
- ✅ Perfect for Node.js applications in production
- ⚠️ Alpine uses musl libc instead of glibc (rarely an issue for Node apps)

**Version: node:20**
- LTS (Long Term Support) Node.js version
- Stable, security-patched, widely used in production
- Released April 2023, supported until April 2026

---

#### `WORKDIR /app`
**What:** Sets the working directory inside the container  
**Why:**
- All subsequent RUN, COPY, CMD commands execute in `/app`
- Creates a clean, isolated application directory
- Prevents conflicts with system files
- Industry standard to use `/app` for application code

---

#### `COPY package*.json ./`
**What:** Copies package.json and package-lock.json (if exists) from host to container  

**Explanation of `*` (glob pattern):**
```
package*.json matches:
✅ package.json
✅ package-lock.json
❌ package-old.json (not matched)
```

**Why copy separately?**
```
This enables DOCKER LAYER CACHING:
┌────────────────────────────────────────┐
│ Layer 1: FROM node:20-alpine           │ (always same, cached)
├────────────────────────────────────────┤
│ Layer 2: COPY package*.json            │ (cached if unchanged)
├────────────────────────────────────────┤
│ Layer 3: RUN npm ci --only=production  │ (cached if dependencies unchanged)
├────────────────────────────────────────┤
│ Layer 4: COPY . .                      │ (re-built if code changes)
├────────────────────────────────────────┤
│ Layer 5: EXPOSE, CMD                   │ (cached)
└────────────────────────────────────────┘

Benefit: If you only change code, only Layer 4 rebuilds
         Dependencies don't reinstall (saves 30-60 seconds)
```

---

#### `RUN npm ci --only=production`
**What:** Installs production dependencies  

**Why `npm ci` instead of `npm install`:**
```
npm install (❌ Not recommended for Docker)
├─ Uses package.json as source
├─ Updates minor/patch versions automatically
├─ Non-deterministic (same code → different builds)
└─ Risk: transitive dependencies change between builds

npm ci (✅ Clean Install - Recommended)
├─ Uses package-lock.json as source of truth
├─ Exact versions, no updates
├─ Deterministic (same package-lock → same install)
└─ Production-grade reproducibility
```

**`--only=production` flag:**
```
Excludes devDependencies:
❌ Removes: nodemon, @types/*, eslint, etc.
✅ Includes: express, mongoose, cors, etc.

Result: ~200MB smaller image (no dev tools in production)
```

**Server Dependencies (from package.json):**
```json
{
  "@google/generative-ai": "^0.24.1",    // AI integration
  "axios": "^1.13.2",                    // HTTP client
  "bcryptjs": "^3.0.3",                  // Password hashing
  "cors": "^2.8.5",                      // Cross-origin requests
  "dotenv": "^17.2.3",                   // Environment variables
  "express": "^5.2.1",                   // Web framework
  "jsonwebtoken": "^9.0.3",              // JWT auth
  "mongoose": "^9.1.2",                  // MongoDB ODM
  "start": "^5.1.0"                      // Unclear/unusual dependency
}
```

---

#### `COPY . .`
**What:** Copies entire project directory (except .dockerignore items) into `/app`  
**Why:**
- Includes source code, routes, models, controllers, etc.
- Placed AFTER dependency installation (leverages caching)
- Ensures all application files are available at runtime

**⚠️ Missing `.dockerignore`:**
```
Recommended additions:
node_modules/        (don't copy, will be created fresh)
.git/                (not needed in container)
.env.local           (use environment variables instead)
README.md            (not needed in production)
.gitignore
.eslintrc
tests/
```

---

#### `EXPOSE 5000`
**What:** Documents that the container listens on port 5000  
**Important Notes:**
- ⚠️ **Does NOT actually expose the port** (just documentation)
- Must map with `-p 5000:5000` when running container
- Server starts on `http://0.0.0.0:5000` inside container
- External access requires port mapping or reverse proxy

**In Kubernetes (K8s):**
```yaml
ports:
  - containerPort: 5000  # EXPOSE equivalent
```

---

#### `CMD ["node", "server.js"]`
**What:** Default command when container starts  
**Execution:**
```
docker run [image] → CMD executes
Equivalent to: node server.js
```

**Alternative format:**
```dockerfile
# Preferred (exec form - signals handled correctly)
CMD ["node", "server.js"]

# Shell form (not ideal - extra bash process)
CMD node server.js
```

**Server startup (from server.js):**
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 FarmVista Backend running on http://localhost:${PORT}`);
});
```

---

### Server Image Build & Optimization

**Build Command:**
```bash
docker build -t farmvista-backend:v1 server/
```

**Image Layers Created:**
```
$ docker image history farmvista-backend:v1

IMAGE          CREATED      CREATED BY                      SIZE
abc123         2 min ago    /bin/sh -c #(nop) CMD ["node"  0B
...            2 min ago    /bin/sh -c #(nop) EXPOSE       0B
...            2 min ago    /bin/sh -c npm ci --only=...   45MB
...            3 min ago    /bin/sh -c #(nop) COPY package 1KB
...            3 min ago    /bin/sh -c #(nop) WORKDIR      0B
...            5 days ago   /bin/sh -c #(nop) FROM node:   149MB
```

**Estimated Final Image Size:** ~200-250 MB

---

## **2. CLIENT DOCKERFILE ANALYSIS**

### File Location
`client/Dockerfile`

### Source Code
```dockerfile
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

### Architecture: Multi-Stage Build

#### **Stage 1: Builder Stage**

##### `FROM node:20-alpine AS build`
**What:** First stage (named "build") with Node.js for compilation  
**Why:**
- Compiles React + Vite code to static HTML/CSS/JS
- Temporary stage not included in final image
- Reduces final image size dramatically

---

##### `WORKDIR /app` through `RUN npm run build`
**What:** Installs dependencies and builds React app  

**Build Process:**
```bash
npm ci                    # Install dependencies (React, Vite, etc.)
npm run build             # Runs: vite build
                          # Output: /app/dist/ (optimized static files)
```

**Client Dependencies (from package.json):**
```json
{
  "react": "^19.2.0",                // UI framework
  "react-dom": "^19.2.0",            // React DOM rendering
  "react-router-dom": "^7.11.0",     // Routing (pages)
  "axios": "^1.13.2",                // HTTP requests to backend
  "framer-motion": "^12.24.0",       // Animations
  "react-markdown": "^10.1.0",       // Render advice as markdown
  "html2pdf.js": "^0.14.0",          // Export PDFs
  "@headlessui/react": "^2.2.9",     // UI components
  "@heroicons/react": "^2.2.0"       // Icon library
}
```

**Build Output:**
```
/app/dist/
├── index.html              (entry point)
├── assets/
│   ├── main-abc123.js      (bundled & minified JS)
│   ├── main-def456.css     (bundled & minified CSS)
│   └── ... other assets
└── manifest.json           (PWA metadata)
```

**Why Vite for React?**
```
Vite advantages over Create React App:
✅ Faster development (instant HMR)
✅ Smaller bundle size
✅ Faster build time
✅ Modern ES modules support
✅ Optimized production build
```

---

#### **Stage 2: Runtime Stage**

##### `FROM nginx:alpine`
**What:** Fresh nginx image (production web server)  
**Why:**
- Lightweight Alpine-based nginx (~30MB)
- High-performance static file serving
- Industry standard for frontend deployment
- Does NOT include Node.js, npm, or build tools

**Size Benefit:**
```
Stage 1 (builder): node:20-alpine + node_modules + source code ≈ 500MB
                   → DISCARDED (not in final image)

Stage 2 (runtime): nginx:alpine + dist folder ≈ 150-200MB
                   → FINAL IMAGE USED IN PRODUCTION ✅

Total image size reduction: ~60-70% smaller!
```

---

##### `COPY --from=build /app/dist /usr/share/nginx/html`
**What:** Copies compiled React app from builder stage  

**Explanation:**
```
--from=build      : Reference previous build stage
/app/dist         : Source path in builder stage
                    (React compiled output)
/usr/share/nginx/html : Nginx document root
                       (where nginx serves static files)
```

**Nginx Configuration (Default):**
```
/usr/share/nginx/html/
├── index.html              → Served at /
├── assets/main.js          → Served at /assets/main.js
└── manifest.json           → Served at /manifest.json

Request flow:
1. Client: GET http://localhost/
2. Nginx: Serves /usr/share/nginx/html/index.html
3. Browser: Loads React app, makes API calls to /api/...
```

---

### Client Multi-Stage Build Benefits

**Security:**
```
Final image contains:
✅ nginx binary (minimal)
✅ React compiled code (HTML/CSS/JS)
✅ Public assets

Final image does NOT contain:
❌ Node.js runtime (not needed)
❌ npm, build tools (not needed)
❌ Source code (exposed vulnerabilities)
❌ devDependencies (potential backdoors)
```

**Performance:**
```
Old way (single stage):
  docker build → 900MB image → docker run → startup
  
New way (multi-stage):
  docker build:
    stage 1: compile code (500MB temporary)
    stage 2: keep only nginx+output (150MB final)
  docker run → 150MB image → faster pull + faster startup
```

**Caching:**
```
Rebuild after code change:
1. Dependencies cached (unless package.json changed)
2. npm ci very fast (already in cache)
3. npm run build rebuilds
4. COPY --from=build very fast (just copy)

Rebuild after dependency change:
1. npm ci re-runs (installs new dependencies)
2. Full rebuild needed
3. Second stage still fast (just copy)
```

---

## **3. DOCKERFILE COMPARISON**

### Side-by-Side Analysis

| Aspect | Server | Client |
|--------|--------|--------|
| **Base Image** | node:20-alpine | node (builder) → nginx (runner) |
| **Build Stage** | Single stage | Multi-stage (2 stages) |
| **Optimization** | Layer caching | Final image 70% smaller |
| **Purpose** | Runtime execution | Compilation → Static serving |
| **Final Image Type** | Runtime (Node.js) | Runtime (Nginx) |
| **Port** | 5000 (API) | 80/443 (HTTP/HTTPS) |
| **Size** | ~200-250 MB | ~150-200 MB |
| **devDependencies** | Removed (`--only=prod`) | Not in final image (multi-stage) |

---

## **4. DOCKER BEST PRACTICES CHECKLIST**

### ✅ Implemented
- [x] Alpine base images (lightweight)
- [x] Separate dependency layer (caching optimization)
- [x] Production-only dependencies (no dev tools)
- [x] npm ci for deterministic builds
- [x] Multi-stage build (client)
- [x] Proper WORKDIR
- [x] EXPOSE documentation
- [x] CMD exec form

### ⚠️ Could Be Improved
- [ ] Add .dockerignore file
- [ ] Use specific nginx version tag (currently `alpine` which floats)
- [ ] Add health checks in Dockerfile (or K8s handles this)
- [ ] Add non-root user for security (optional for this project)
- [ ] Add labels for metadata (organization, version, etc.)
- [ ] Document environment variables needed

---

## **5. BUILDING & RUNNING CONTAINERS**

### Build Commands

**Server:**
```bash
docker build -t farmvista-backend:v1 ./server
docker build -t farmvista-backend:latest ./server
```

**Client:**
```bash
docker build -t farmvista-frontend:v1 ./client
docker build -t farmvista-frontend:latest ./client
```

**Build with BuildKit (faster, better caching):**
```bash
DOCKER_BUILDKIT=1 docker build -t farmvista-backend:v1 ./server
```

---

### Run Commands

**Server Container (Development):**
```bash
docker run -p 5000:5000 \
  -e MONGO_URI="mongodb://localhost:27017/farmvista" \
  -e NODE_ENV="development" \
  -e FRONTEND_URL="http://localhost:5173" \
  --name farmvista-backend \
  farmvista-backend:v1
```

**Client Container (Development):**
```bash
docker run -p 80:80 \
  --name farmvista-frontend \
  farmvista-frontend:v1
```

**Access:**
- Backend API: http://localhost:5000
- Frontend: http://localhost:80

---

### Docker Compose (Recommended)

**Hypothetical docker-compose.yml:**
```yaml
version: '3.8'

services:
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      MONGO_URI: "mongodb://mongo:27017/farmvista"
      NODE_ENV: "production"
      FRONTEND_URL: "http://localhost"
    depends_on:
      - mongo
    networks:
      - farmvista-net

  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - farmvista-net

  mongo:
    image: mongo:7-alpine
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - farmvista-net

volumes:
  mongo-data:

networks:
  farmvista-net:
    driver: bridge
```

**Run entire stack:**
```bash
docker-compose up -d
```

---

## **6. KUBERNETES INTEGRATION**

### How Dockerfiles Connect to K8s

**Kubernetes Deployment (from k8s/backend-deployment.yaml):**
```yaml
spec:
  containers:
    - name: backend
      image: farmvista-backend:V1        # ← References Docker image
      imagePullPolicy: IfNotPresent       # ← Use local image
      ports:
        - containerPort: 5000            # ← From EXPOSE in Dockerfile
      env:
        - name: MONGO_URI
          value: ""
```

**Relationship:**
```
Dockerfile (definition)
    ↓
docker build (creates image)
    ↓
Docker Registry (stores image)
    ↓
Kubernetes (pulls & runs image)
    ↓
Container (running instance)
```

---

## **7. DOCKERFILE SECURITY CONSIDERATIONS**

### Current Setup
```
✅ Minimal base images (Alpine)
✅ No unnecessary tools
✅ Production dependencies only
⚠️ No user restrictions (running as root)
⚠️ No secrets management (env vars for passwords)
```

### Hardening Recommendations

**1. Add non-root user (server/Dockerfile):**
```dockerfile
FROM node:20-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Switch to non-root user
USER nodejs

EXPOSE 5000
CMD ["node", "server.js"]
```

**2. Scan for vulnerabilities:**
```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image farmvista-backend:v1
```

---

## **8. DOCKER IMAGE INSPECTION**

### View Image Details
```bash
# Image history (layers)
docker image history farmvista-backend:v1

# Inspect image metadata
docker image inspect farmvista-backend:v1

# View image size
docker images | grep farmvista

# Export image
docker save farmvista-backend:v1 > farmvista-backend.tar
```

### Check Layer Composition
```bash
# See what's in each layer
docker image history --no-trunc farmvista-backend:v1
```

---

## **9. ENVIRONMENT VARIABLES & SECRETS**

### Server Environment Variables (needed at runtime)

From `server.js`:
```javascript
require('dotenv').config();  // Reads .env file (development)
process.env.MONGO_URI       // Database connection
process.env.NODE_ENV        // Deployment environment
process.env.FRONTEND_URL    // CORS origin
process.env.PORT            // Server port (default 5000)
```

**In Docker:**
```bash
docker run -e MONGO_URI="mongodb://mongo:27017/farmvista" \
           -e NODE_ENV="production" \
           farmvista-backend:v1
```

**In Kubernetes:**
```yaml
env:
  - name: MONGO_URI
    valueFrom:
      secretKeyRef:
        name: db-secrets
        key: mongo-uri
  - name: NODE_ENV
    value: "production"
```

---

## **10. TROUBLESHOOTING COMMON ISSUES**

### Issue: "Cannot find module 'express'"
```
Cause: npm ci not running, or COPY . . before npm ci
Fix: Ensure npm ci runs before COPY . .
```

### Issue: "EADDRINUSE: Port already in use"
```
Cause: Port 5000 already bound on host
Fix: docker run -p 5001:5000  (map to different host port)
```

### Issue: "Image is too large (>500MB)"
```
Cause: node_modules copied to image, or multi-stage build not used
Fix: Add .dockerignore with "node_modules/"
     Use multi-stage builds for frontend
```

### Issue: "Container exits immediately"
```
Cause: CMD syntax error or application crash
Fix: 
  docker logs container-id      (see error)
  docker exec -it container-id /bin/sh  (debug inside)
```

---

## **Summary Table**

| Dockerfile | Purpose | Base Image | Size | Key Feature |
|------------|---------|------------|------|-------------|
| server/Dockerfile | Run Node.js backend | node:20-alpine | ~220MB | Simple, cached layers |
| client/Dockerfile | Serve React app | nginx:alpine | ~170MB | Multi-stage build |

---

**Generated:** February 4, 2026  
**Project:** FarmVista  
**Status:** All Dockerfiles analyzed and documented
