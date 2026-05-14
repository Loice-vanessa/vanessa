# Vanessa Healthcare Platform

This repository contains a Spring Boot backend and a React/Vite frontend for a small healthcare management prototype.

## What is included

- Authentication for patients, doctors, and administrators
- Patient and doctor dashboards
- Appointment scheduling and availability management
- Medical records
- Insurance profile capture for Rwandan healthcare coverage
- Reports with CSV export for patients and doctors
- Profile pages
- Seed data for development/demo mode

## Documentation

- [Phase 2 to Phase 4 report](docs/project-phases.md)
- [Software test plan](docs/test-plan.md)
- [SVN setup notes](docs/version-control-svn.md)

## Run with Docker

1. Start Docker.
2. Run `docker compose build`.
3. Run `docker compose up`.
4. Open the frontend in the browser at `http://localhost:8082`.

The backend API is available directly at `http://localhost:8081`, and the frontend container proxies API requests through `/api`.

The backend uses the `seed` profile in the compose setup so the demo data is loaded automatically.

## Verification

Run backend tests:

```bash
cd backend
.\mvnw.cmd test
```

Build the frontend:

```bash
cd frontend
npm run build
```

Run the Docker stack:

```bash
docker compose build
docker compose up
```

## Demo credentials

Use these seeded accounts when running the app with the demo database:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@dhams.com` | `Admin@123` |
| Doctor | `nadine.keza@dhams.com` | `Doctor@123` |
| Doctor | `eric.ntwali@dhams.com` | `Doctor@123` |
| Doctor | `claire.uwase@dhams.com` | `Doctor@123` |
| Doctor | `olivier.hakizimana@dhams.com` | `Doctor@123` |
| Patient | `vanessa.ishimwe@dhams.com` | `Patient@123` |
| Patient | `jean.nkurunziza@dhams.com` | `Patient@123` |
| Patient | `aimee.mukamana@dhams.com` | `Patient@123` |
| Patient | `diane.akimana@dhams.com` | `Patient@123` |

## Vercel Hosting

This repo is set up so the React frontend can be deployed on Vercel as a single-page app.

1. Let Vercel use the root `vercel.json` file.
2. Add the environment variable `VITE_API_BASE_URL` to point at your deployed backend, for example `https://your-backend.example.com/api`.

The Vercel config also includes the SPA rewrite so direct page refreshes work on routes like `/login`, `/patient/dashboard`, and `/doctor/dashboard`.
