# EventHive

EventHive is a modern event management platform for tech fests, hackathons, and workshops. It supports user and admin roles, event creation with image uploads, registration, check-in, analytics, and more. The project is built with Angular (frontend) and ASP.NET Core (backend, REST API, SQLite).

## Features
- User authentication (JWT)
- Role-based navigation (User/Admin)
- Event creation with image upload
- Event listing, details, and registration
- Admin event management, attendee check-in, analytics dashboard
- Modern dark blue UI theme
- Analytics dashboard with live metrics
- Secure file upload and static file serving

## Tech Stack
- **Frontend:** Angular, Ng-Zorro Ant Design, TypeScript
- **Backend:** ASP.NET Core Web API, Entity Framework Core, SQLite

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- .NET 8 SDK or later

### Setup

#### 1. Clone the repository
```sh
git clone https://github.com/your-username/eventhive.git
cd eventhive
```

#### 2. Backend Setup
```sh
cd src/TechFest.API
dotnet restore
dotnet ef database update # (if migrations are present)
dotnet run
```
- The backend runs on `http://localhost:5000` by default.

#### 3. Frontend Setup
```sh
cd frontend
npm install
npm start
```
- The frontend runs on `http://localhost:4200` by default.

### Environment
- Backend config: `src/TechFest.API/appsettings.json`
- Frontend config: `frontend/src/environments/`

## Folder Structure
```
frontend/         # Angular app
src/TechFest.API/ # ASP.NET Core API
src/TechFest.Core/        # Core business logic
src/TechFest.Infrastructure/ # Data access, services
```

## Development
- Use Angular CLI for frontend development.
- Use dotnet CLI for backend development.
- All API endpoints are under `/api/`.

## Deployment
- Build Angular with `ng build`.
- Publish .NET API with `dotnet publish`.

## License
MIT

---

### Credits
- UI inspired by modern SaaS dashboards.
- Built with ❤️ for tech communities.

---

# Slide 1 — Project Title

**College Tech-Fest Portal**

*A Smart Digital Platform for Discovering and Managing Technical Events in Colleges*

**Subtitle (optional)**
Full-Stack Web Application using **Angular + ASP.NET Core Web API**

---

# Slide 2 — Introduction

The **College Tech-Fest Portal** is a full-stack web application designed to simplify the process of discovering, registering, and managing technical events in a college environment.

The platform allows students to explore workshops, hackathons, and seminars while providing administrators with tools to publish events, manage registrations, and track attendance.

This system improves event organization by providing:

* A centralized event management platform
* Secure user authentication
* Real-time seat availability tracking
* Easy registration and attendance monitoring

The project follows **Clean Architecture** principles to ensure scalability, maintainability, and security.

---

# Slide 3 — Technology Stack

**Backend Framework**

* ASP.NET Core 9.0 Web API
* Provides secure and high-performance REST API endpoints

**Frontend Framework**

* Angular 17 with Standalone Components
* Used to build a dynamic Single Page Application (SPA)

**UI Library**

* Ant Design (NG-ZORRO)
* Provides professional UI components such as tables, forms, modals, and progress bars

**Database**

* SQLite
* Lightweight relational database for efficient data storage

**ORM**

* Entity Framework Core
* Converts C# models into database tables and manages queries using LINQ

**Authentication & Security**

* JWT (JSON Web Tokens) for session management
* BCrypt for secure password hashing

---

# Slide 4 — Key Functionalities

**Student Features**

* Browse all available technical events
* Filter events by category or title
* Register for workshops, hackathons, or seminars
* View registered events in **My Events Dashboard**
* Generate a **QR code ticket** for event entry
* Cancel registration if needed

**Admin Features**

* Secure admin login
* Create and publish new events
* Upload event banners/images
* Manage event registrations
* Mark student attendance using **Check-in system**
* View analytics such as most popular events and total registrations

---

# Slide 5 — Future Scope

The system can be further enhanced with several advanced features:

* **Email notification system** for event confirmations
* **Online payment integration** for paid events
* **Real-time updates using WebSockets or SignalR**
* **Mobile application version** for better accessibility
* **AI-based event recommendations** based on student interests
* **Certificate generation system** for event participants
* Integration with **college student databases**

These improvements can transform the portal into a complete **campus event management platform**.

---

✅ If you want, I can also give you **one extra slide (Architecture Diagram slide)** which will make your presentation look **much more professional** and help teachers understand the system faster.
