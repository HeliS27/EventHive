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
