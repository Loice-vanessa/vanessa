# DHAMS Software Test Plan

## Objective

Validate that DHAMS works correctly as a Rwanda-focused healthcare prototype for patients, doctors, and administrators. Testing confirms authentication, role access, appointment scheduling, availability management, medical records, insurance capture, reporting, CSV export, Docker startup, and seeded demo data.

## Scope

The test plan covers:

- Spring Boot backend APIs;
- Spring Security, JWT, CORS, and stateless access rules;
- PostgreSQL persistence through repositories and services;
- React frontend routing and production build;
- Docker Compose startup;
- manual user journeys for patient, doctor, and admin roles.

Out of scope for the prototype:

- payment processing;
- national health ID integration;
- SMS gateway integration;
- full hospital information system interoperability;
- automated browser E2E testing.

## Test Environment

| Item | Tool |
| --- | --- |
| Backend | Java 21, Spring Boot, Maven |
| Frontend | React, Vite, Nginx |
| Database | PostgreSQL |
| Containerization | Docker and Docker Compose |
| Browser | Chrome or Edge |
| Version control evidence | Local SVN repository |

## Entry Criteria

- Backend and frontend source code are available.
- PostgreSQL is running locally or through Docker.
- Demo data can be loaded using the Spring `seed` profile.
- Dependencies are installed for Maven and npm.
- Docker Desktop is running for container verification.

## Exit Criteria

- Backend test command passes.
- Frontend production build passes.
- Docker Compose stack starts successfully.
- Critical patient, doctor, and admin user journeys pass.
- No blocking authentication, CORS, appointment, report, or database errors remain.

## Automated Test Evidence

Backend:

```bash
cd backend
.\mvnw.cmd test
```

Expected result:

- Maven reports successful test execution.
- `SecurityConfigTest` confirms configured CORS origin patterns and POST preflight support.

Frontend:

```bash
cd frontend
npm run build
```

Expected result:

- Vite creates a production build successfully.
- Routes, reports, insurance profile UI, and export logic compile without errors.

Optional lint check:

```bash
cd frontend
npm run lint
```

If lint fails because of existing style configuration, record the output and fix separately instead of treating it as a runtime failure.

Docker:

```bash
docker compose build
docker compose up
```

Expected result:

- PostgreSQL container starts.
- Backend starts on port `8081`.
- Frontend starts on port `8082`.
- Browser opens DHAMS at `http://localhost:8082`.

## Test Cases

| ID | Area | Test Scenario | Steps | Expected Result |
| --- | --- | --- | --- | --- |
| T01 | Authentication | Patient valid login | Login with `vanessa.ishimwe@dhams.com` and `Patient@123` | Patient dashboard opens and token is stored |
| T02 | Authentication | Doctor valid login | Login with `nadine.keza@dhams.com` and `Doctor@123` | Doctor dashboard opens and token is stored |
| T03 | Authentication | Admin valid login | Login with `admin@dhams.com` and `Admin@123` | Admin dashboard opens and token is stored |
| T04 | Authentication | Invalid credentials | Login with a valid email and wrong password | API returns controlled authentication error |
| T05 | Security/CORS | Browser login request | Submit login from frontend running on localhost | POST is accepted and not blocked by CSRF/CORS |
| T06 | Patient appointments | Book appointment | Select doctor, date, time, and submit appointment | Appointment is created or clear validation is shown |
| T07 | Patient records | View medical records | Open patient medical records page | Seeded records display correctly |
| T08 | Patient insurance | Update insurance | Save provider, member number, coverage type, and expiry date | Profile reload shows saved insurance data |
| T09 | Patient reports | Export patient report | Open patient reports and click export | CSV file downloads with summary, appointments, and records |
| T10 | Doctor availability | Add availability | Doctor creates date and time availability | Availability appears in schedule/booking flow |
| T11 | Doctor schedule | Review appointments | Doctor opens schedule page | Assigned appointments appear with correct statuses |
| T12 | Doctor reports | Export doctor report | Open doctor reports and click export | CSV file downloads with appointment and patient summary |
| T13 | Admin doctors | View doctors | Admin opens doctors page | Seeded doctors are listed |
| T14 | Admin patients | View patients | Admin opens patients page | Seeded patients are listed |
| T15 | Admin appointments | View appointments | Admin opens appointments page | Appointment table shows seeded data |
| T16 | Docker | Run full stack | Start with Docker Compose and open frontend | App loads at `http://localhost:8082` |
| T17 | Data seed | Verify demo data | Login as seeded users and inspect dashboards | Rwanda-focused demo data is visible |

## Defect Handling

For each defect, record:

- defect ID;
- affected role or feature;
- steps to reproduce;
- expected result;
- actual result;
- severity;
- screenshot or console/network evidence;
- fix status.

Severity levels:

- Critical: blocks login, app startup, or database connection.
- High: blocks appointment, records, reports, or role access.
- Medium: incorrect display or missing non-critical data.
- Low: spelling, spacing, or minor UI polish.

## Acceptance Checklist

- Patient can log in, book appointments, view records, update insurance, and export reports.
- Doctor can log in, manage availability, view schedule, review patients, and export reports.
- Admin can log in and view platform doctors, patients, and appointments.
- Invalid login does not crash the app and returns a controlled error.
- Backend tests pass.
- Frontend build passes.
- Docker Compose starts all services.
- Seeded Rwanda-focused data appears in the UI.
