# WSU Campus Maintenance System - Complete Documentation

A comprehensive campus maintenance work order management system built for Wright State University, consisting of three main components: a Docker-based database, a Spring Boot backend service, and an Angular frontend application.

---

## 📑 Table of Contents

- [System Overview](#system-overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Repository Guide](#repository-guide)
  - [CS4900 Repo - Database](#cs4900-repo---database)
  - [mr-fixit-service - Backend API](#mr-fixit-service---backend-api)
  - [mr-fixit-ui - Frontend Application](#mr-fixit-ui---frontend-application)
- [Complete Setup Guide](#complete-setup-guide)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

---

## 🎯 System Overview

The WSU Campus Maintenance System is a modern, full-stack application that enables:

- **Students**: Submit maintenance requests for campus facilities
- **Technicians**: Track and manage work orders efficiently
- **Administrators**: Monitor system performance and analytics

### Key Features

- 📊 Real-time dashboard with statistics and analytics
- 📋 Comprehensive work order management
- 🔍 Advanced filtering and search capabilities
- 📱 Responsive design for all devices
- 🔒 Secure API with data validation
- 📈 Performance tracking and reporting

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     WSU Maintenance System                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │   Angular    │◄────►│  Spring Boot │◄────►│  MariaDB  │ │
│  │   Frontend   │      │   Backend    │      │  Database │ │
│  │  (Port 4200) │      │  (Port 8080) │      │(Port 3306)│ │
│  └──────────────┘      └──────────────┘      └───────────┘ │
│                                                               │
│  mr-fixit-ui           mr-fixit-service      Docker Container│
│  (Repository 3)        (Repository 2)        (Repository 1)  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Prerequisites

Before setting up any component, ensure you have the following installed:

### Required Software

1. **Docker Desktop**
   - Download: [https://www.docker.com/](https://www.docker.com/)
   - Version: Latest stable release
   - Purpose: Running the MariaDB database container
   - Installation: Use default options when prompted

2. **Node.js**
   - Download: [https://nodejs.org/](https://nodejs.org/)
   - Version: v18 or higher
   - Purpose: Running the Angular frontend application
   - Verify installation: `node --version`

3. **Java Development Kit (JDK)**
   - Download: [https://www.oracle.com/java/technologies/downloads/](https://www.oracle.com/java/technologies/downloads/)
   - Version: JDK 17 or higher
   - Purpose: Running the Spring Boot backend service
   - Verify installation: `java --version`

4. **Angular CLI**
   - Install via npm: `npm install -g @angular/cli`
   - Version: v20 or higher
   - Purpose: Angular project management and development
   - Verify installation: `ng --version`

5. **DBeaver Community Edition**
   - Download: [https://dbeaver.io/download/](https://dbeaver.io/download/)
   - Purpose: Database management and querying
   - Optional but highly recommended

6. **Bruno** (API Testing Tool)
   - Download: [https://www.usebruno.com/](https://www.usebruno.com/)
   - Purpose: Testing API endpoints
   - Alternative: Postman or any REST client

### Optional Tools

- **VS Code**: Recommended IDE with Java and Angular extensions
- **Gradle**: Usually bundled with the Spring Boot project

---

## 📂 Repository Guide

### CS4900 Repo - Database

**Repository**: CS4900  
**Component**: MariaDB Database (Docker Container)  
**Technology**: Docker, MariaDB

#### What It Contains

- Docker Compose configuration for MariaDB
- Database initialization script (`init_mr_fix_it.sql`)
- Database schema and seed data
- DBeaver connection instructions

#### Quick Start

```bash
# Navigate to the database directory
cd CS4900

# Start the database container (first time)
docker compose up

# Start the container (subsequent times)
docker compose start

# Stop the container (preserves data)
docker compose stop

# Remove the container (deletes all data - use carefully!)
docker compose down
```

#### Docker Compose Configuration

Update the `docker-compose.yml` file as needed:

```yaml
version: '3.8'
services:
  mariadb:
    image: mariadb:latest
    container_name: WSU_4900_DB_Design  # Unique container name
    restart: always
    volumes:
      # Update this to match your init script name
      - ./init_mr_fix_it.sql:/docker-entrypoint-initdb.d/init.sql
      # Optional: Uncomment for data persistence
      # - ./data:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=Mr_Fix_It  # Should match your init script
      - MYSQL_USER=user
      - MYSQL_PASSWORD=password
    ports:
      # Host:Container port mapping
      - 3306:3306  # Change host port (first number) if 3306 is already in use
```

#### DBeaver Setup

1. Open DBeaver Community Edition
2. Click "New Database Connection"
3. Select "MariaDB" from the database list
4. Enter connection details:
   - **Host**: localhost
   - **Port**: 3306 (or your custom host port from docker-compose.yml)
   - **Database**: Mr_Fix_It
   - **Username**: user
   - **Password**: password
5. Test the connection
6. Click "Finish"

#### Running Multiple Database Containers

To run multiple MariaDB containers simultaneously:

1. Create separate folders for each database
2. Each folder should contain:
   - `docker-compose.yml` with unique `container_name` and host port
   - Database initialization script
3. Example port configuration:
   ```yaml
   # Database 1: docker-compose.yml
   ports:
     - 3306:3306
   
   # Database 2: docker-compose.yml
   ports:
     - 3307:3306  # Different host port
   
   # Database 3: docker-compose.yml
   ports:
     - 3308:3306  # Different host port
   ```
4. Connect to each database in DBeaver using the respective host port

---

### mr-fixit-service - Backend API

**Repository**: mr-fixit-service  
**Component**: Spring Boot REST API  
**Technology**: Java, Spring Boot, Gradle

#### What It Contains

- RESTful API endpoints for work order management
- Business logic and data validation
- Database integration with JPA/Hibernate
- H2 Console for development/testing
- Bruno API collection for endpoint testing

#### Project Structure

```
mr-fixit-service/
├── src/
│   ├── main/
│   │   ├── java/com/winsupply/mrfixitservice/
│   │   │   ├── MrFixitServiceApplication.java
│   │   │   ├── controllers/         # REST endpoints
│   │   │   ├── services/            # Business logic
│   │   │   ├── repositories/        # Data access
│   │   │   └── models/              # Entity classes
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── db/
│   └── docker-compose.yml           # Database container config
├── bruno/
│   └── mr-fix-it-service/          # API test collection
└── build.gradle
```

#### Prerequisites for Backend

- Docker Desktop running with database container active
- Java JDK 17 or higher installed
- Gradle (usually bundled with project)

#### Recommended VS Code Extensions

- [Extension Pack for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)
- [Spotless Gradle](https://marketplace.visualstudio.com/items?itemName=richardwillis.vscode-spotless-gradle)

#### How to Run

**Step 1: Start the Database Container**

> **Important**: The backend service requires a database connection to start.

**Option A - Using Docker Desktop:**
1. Open Docker Desktop
2. Locate the `Mr_Fix_It` container
3. Click the play button if it's not already running

**Option B - Using Docker Compose:**
```bash
# Navigate to the database directory
cd mr-fixit-service/db

# Start the container in detached mode
docker-compose up -d
```

**Step 2: Run the Spring Boot Application**

**Using VS Code:**
1. Navigate to `/src/main/java/com/winsupply/mrfixitservice/MrFixitServiceApplication.java`
2. Right-click on the file
3. Select "Run Java"
4. Wait for console message: "Started MrFixitServiceApplication in x seconds"

**Using Command Line:**
```bash
# Navigate to the service directory
cd mr-fixit-service

# Run with Gradle wrapper (Windows)
./gradlew bootRun

# Run with Gradle wrapper (Mac/Linux)
./gradlew bootRun
```

**Step 3: Verify the Service is Running**

The service should be accessible at: `http://localhost:8080/mr-fixit-service`

#### H2 Console Access

For development and testing, an H2 console is available:

**URL**: `http://localhost:8080/mr-fixit-service/h2-console`

#### API Testing with Bruno

1. Open Bruno
2. Click "Open Collection"
3. Navigate to and select: `/mr-fixit-service/bruno/mr-fix-it-service`
4. Set environment to "Local" (this configures the `BASE_URL` variable)
5. Select any request from the collection
6. Click the send arrow to test the endpoint

#### Common API Endpoints

```
GET    /api/work-orders           # Get all work orders
GET    /api/work-orders/{id}      # Get specific work order
POST   /api/work-orders           # Create new work order
PUT    /api/work-orders/{id}      # Update work order
DELETE /api/work-orders/{id}      # Delete work order
GET    /api/buildings             # Get all buildings
GET    /api/rooms                 # Get all rooms
GET    /api/technicians           # Get all technicians
```

---

### mr-fixit-ui - Frontend Application

**Repository**: mr-fixit-ui (also known as wsu-test)  
**Component**: Angular Web Application  
**Technology**: Angular 20, TypeScript, SCSS

#### What It Contains

A modern, responsive Angular application with:

- **Dashboard**: Real-time statistics and analytics
- **Work Order Management**: Create, view, edit, and track work orders
- **Advanced Filtering**: Search and filter by status, category, etc.
- **Responsive Design**: Mobile-first approach for all devices
- **Accessibility**: ARIA labels and keyboard navigation

#### Features in Detail

**📊 Dashboard**
- Real-time work order statistics
- Status breakdown visualization
- Category analysis with progress bars
- Technician performance metrics
- Responsive cards and charts

**📋 Work Order Management**
- Comprehensive list view with sorting
- Advanced filtering (status, category, search)
- Pagination for large datasets
- Detailed work order view with complete information
- Status tracking with visual badges

**🎨 User Experience**
- Clean, professional design
- Accessibility features (ARIA labels, semantic HTML)
- Loading states and error handling
- Color-coded status indicators
- Mobile-first responsive layout

#### Technology Stack

- **Framework**: Angular 20 with standalone components
- **Language**: TypeScript with strict type checking
- **Styling**: SCSS with CSS custom properties and mixins
- **State Management**: Angular Signals for reactive state
- **HTTP Client**: Angular HttpClient with interceptors
- **Testing**: Jest for unit testing
- **Build Tool**: Angular CLI with Webpack

#### Project Structure

```
src/
├── app/
│   ├── features/                    # Feature modules
│   │   ├── dashboard/               # Dashboard feature
│   │   │   ├── dashboard.component.ts
│   │   │   ├── dashboard.component.html
│   │   │   └── dashboard.component.scss
│   │   └── work-orders/             # Work orders feature
│   │       ├── components/          # Work order components
│   │       │   ├── work-order-detail/
│   │       │   ├── work-order-form/
│   │       │   └── work-order-list/
│   │       └── work-orders.routes.ts
│   ├── services/                    # Application services
│   │   ├── api.service.ts           # HTTP API service
│   │   ├── work-order.service.ts    # Work order business logic
│   │   ├── building.service.ts      # Building management
│   │   ├── room.service.ts          # Room management
│   │   ├── student.service.ts       # Student management
│   │   ├── maintenance-technician.service.ts
│   │   └── lookup.service.ts        # Lookup data service
│   ├── shared/                      # Shared components and utilities
│   │   ├── components/              # Reusable UI components
│   │   │   ├── status-badge/        # Status indicator component
│   │   │   ├── loading-spinner/     # Loading indicator
│   │   │   └── error-notification/
│   │   ├── models/                  # TypeScript interfaces and types
│   │   ├── interceptors/            # HTTP interceptors
│   │   └── utils/                   # Utility functions
│   ├── app.config.ts                # Application configuration
│   ├── app.routes.ts                # Main routing configuration
│   └── app.component.ts             # Root component
├── styles/                          # Global styles
│   ├── variables.scss               # SCSS variables
│   ├── mixins.scss                  # SCSS mixins
│   └── _index.scss                  # Style imports
└── environments/                    # Environment configurations
    ├── environment.ts               # Development config
    └── environment.prod.ts          # Production config
```

#### Prerequisites for Frontend

- Node.js v18 or higher
- npm or yarn package manager
- Angular CLI v20 or higher

#### Installation and Setup

```bash
# Clone/navigate to the repository
cd mr-fixit-ui  # or wsu-test

# Install dependencies
npm install

# Start the development server
ng serve

# The application will be available at http://localhost:4200
```

#### Available Scripts

```bash
# Start development server with live reload
ng serve

# Build for production
ng build

# Build for production with optimization
ng build --configuration production

# Run unit tests
ng test

# Run linting
ng lint

# Generate a new component
ng generate component component-name

# Generate a new service
ng generate service service-name
```

#### Development Server

The Angular development server runs on `http://localhost:4200` by default. The application will automatically reload when you make changes to source files.

#### Build Output

Production builds are output to the `dist/` directory:

```bash
ng build --configuration production
```

#### Design System

**Color Palette:**
- **Primary**: Blue tones for main actions and branding
- **Success**: Green (#28a745) for completed states
- **Warning**: Orange (#ffc107) for in-progress states
- **Danger**: Red (#dc3545) for errors and cancelled states
- **Info**: Light blue for informational content

**Typography:**
- Responsive font sizing
- Clear hierarchy with heading levels
- Readable body text

**Responsive Breakpoints:**
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px and above

#### State Management

The application uses Angular Signals for reactive state:

```typescript
// Example: Work order signal
workOrders = signal<WorkOrder[]>([]);

// Computed values
activeOrders = computed(() => 
  this.workOrders().filter(wo => wo.status === 'Open')
);

// Effects for side effects
effect(() => {
  console.log('Work orders updated:', this.workOrders().length);
});
```

#### Key Components

**Dashboard Component**
- Location: `src/app/features/dashboard/`
- Purpose: Main landing page with statistics
- Features: Real-time stats, status breakdown, category analysis

**Work Order List Component**
- Location: `src/app/features/work-orders/components/work-order-list/`
- Purpose: Display and manage work orders
- Features: Sorting, filtering, pagination

**Work Order Detail Component**
- Location: `src/app/features/work-orders/components/work-order-detail/`
- Purpose: View complete work order information
- Features: Full details, timeline, status tracking

**Status Badge Component**
- Location: `src/app/shared/components/status-badge/`
- Purpose: Reusable status indicator
- Features: Color-coded, multiple sizes, accessible

---

## 🚀 Complete Setup Guide

Follow these steps to set up the entire system from scratch:

### Step 1: Install Prerequisites

1. Install Docker Desktop
2. Install Node.js (v18+)
3. Install Java JDK (17+)
4. Install Angular CLI: `npm install -g @angular/cli`
5. Install DBeaver (optional but recommended)
6. Install Bruno or your preferred API testing tool

### Step 2: Set Up the Database

```bash
# Navigate to the database repository
cd CS4900

# Start the database container
docker compose up

# Verify the container is running in Docker Desktop
# or check with: docker ps
```

### Step 3: Set Up the Backend Service

```bash
# Navigate to the backend repository
cd mr-fixit-service

# Ensure the database container is running (from Step 2)

# Start the Spring Boot application
./gradlew bootRun

# Verify it's running at http://localhost:8080/mr-fixit-service
```

### Step 4: Set Up the Frontend Application

```bash
# Navigate to the frontend repository
cd mr-fixit-ui

# Install dependencies
npm install

# Start the development server
ng serve

# Access the application at http://localhost:4200
```

### Step 5: Verify the Complete Setup

1. **Database**: Open DBeaver and connect to the database
2. **Backend**: Open Bruno and test API endpoints
3. **Frontend**: Open browser to `http://localhost:4200` and navigate the UI
4. **End-to-End**: Create a work order in the UI and verify it appears in the database

---

## 🔄 Development Workflow

### Daily Development Routine

1. **Start Docker Desktop** (if not already running)
2. **Start Database Container**:
   ```bash
   cd CS4900
   docker compose start
   ```
3. **Start Backend Service**:
   ```bash
   cd mr-fixit-service
   ./gradlew bootRun
   ```
4. **Start Frontend Application**:
   ```bash
   cd mr-fixit-ui
   ng serve
   ```

### Making Changes

**Database Changes:**
1. Update `init_mr_fix_it.sql` with new schema
2. Stop and remove the container: `docker compose down`
3. Restart to apply changes: `docker compose up`

**Backend Changes:**
1. Modify Java code in `mr-fixit-service`
2. Spring Boot will auto-reload (if using dev tools)
3. Or restart the application

**Frontend Changes:**
1. Modify TypeScript/HTML/SCSS in `mr-fixit-ui`
2. Angular dev server auto-reloads changes
3. Check browser for updates

### Testing Workflow

1. **Backend API Testing**: Use Bruno collection
2. **Frontend Testing**: Run `ng test` for unit tests
3. **Database Testing**: Use DBeaver to query and verify data
4. **Integration Testing**: Test complete flows through the UI

---

## 🐛 Troubleshooting

### Database Issues

**Problem**: "Port 3306 is already in use"

**Solutions**:
- You have MariaDB installed locally. Change the host port in `docker-compose.yml`:
  ```yaml
  ports:
    - 3307:3306  # Use 3307 instead of 3306
  ```
- Another container is using port 3306. Use `docker ps` to check running containers

**Problem**: "Password error" or "Access denied"

**Solutions**:
- Verify credentials in `docker-compose.yml` match your connection settings
- Try removing and recreating the container:
  ```bash
  docker compose down
  docker compose up
  ```

**Problem**: Database initialization script not running

**Solutions**:
- Ensure the script path in docker-compose.yml is correct
- Check that the SQL file has no syntax errors
- Remove the container and recreate: `docker compose down` then `docker compose up`

### Backend Service Issues

**Problem**: "Cannot connect to database"

**Solutions**:
- Ensure Docker container is running: `docker ps`
- Check `application.properties` database configuration
- Verify port matches docker-compose.yml host port

**Problem**: "Port 8080 is already in use"

**Solutions**:
- Another application is using port 8080
- Change the port in `application.properties`:
  ```properties
  server.port=8081
  ```
- Update Bruno environment BASE_URL accordingly

**Problem**: Application fails to start

**Solutions**:
- Check Java version: `java --version` (should be 17+)
- Clean and rebuild: `./gradlew clean build`
- Check console for specific error messages

### Frontend Application Issues

**Problem**: "ng: command not found"

**Solutions**:
- Angular CLI not installed globally
- Install with: `npm install -g @angular/cli`
- Verify with: `ng --version`

**Problem**: "Cannot find module" errors

**Solutions**:
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules
  npm install
  ```

**Problem**: "Port 4200 is already in use"

**Solutions**:
- Another Angular app is running
- Kill the process or use a different port:
  ```bash
  ng serve --port 4201
  ```

**Problem**: API calls failing (404, 500 errors)

**Solutions**:
- Verify backend service is running on port 8080
- Check browser console for specific error messages
- Verify API endpoint URLs in service files
- Check CORS configuration in backend

### General Issues

**Problem**: Changes not reflecting

**Solutions**:
- Hard refresh browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Clear browser cache
- Restart the affected service
- Check file is saved

**Problem**: Docker Desktop not starting

**Solutions**:
- Restart Docker Desktop
- Check system requirements
- Ensure virtualization is enabled in BIOS

---

## 📚 Additional Resources

### Documentation Links

- **Angular**: [https://angular.dev](https://angular.dev)
- **Spring Boot**: [https://spring.io/projects/spring-boot](https://spring.io/projects/spring-boot)
- **Docker**: [https://docs.docker.com](https://docs.docker.com)
- **MariaDB**: [https://mariadb.org/documentation/](https://mariadb.org/documentation/)
- **TypeScript**: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)

### Learning Resources

- **Angular Tutorial**: [https://angular.dev/tutorials](https://angular.dev/tutorials)
- **Spring Boot Guides**: [https://spring.io/guides](https://spring.io/guides)
- **Docker Getting Started**: [https://docs.docker.com/get-started/](https://docs.docker.com/get-started/)

---

## 👥 Team & Support

For questions, issues, or contributions:

1. Check this documentation first
2. Review the troubleshooting section
3. Search existing issues in the repository
4. Contact your team lead or instructor
5. Create a new issue with detailed information

---

## 🎓 Academic Information

**Course**: CS 4900  
**Institution**: Wright State University  
**Semester**: Fall 2025  
**Project**: WSU Campus Maintenance System

---

