# DHAMS Phase 2 to Phase 4 Compliance Report

## Phase 2: Software Development Prototype

DHAMS is a Rwanda-focused digital healthcare appointment and records management prototype. It helps patients, doctors, and administrators validate the main workflows of a clinic or hospital system before full production deployment.

The prototype supports:

- role-based login for patients, doctors, and administrators;
- patient registration and profile management;
- doctor profile and availability management;
- appointment booking and appointment status tracking;
- medical record viewing and creation;
- insurance information capture for Rwandan healthcare coverage;
- patient and doctor reports with CSV export;
- seeded demo data for Rwanda-based doctors, patients, appointments, records, and notifications.

The prototype is intentionally not a final national-scale health platform. It is an early working version used to test assumptions about authentication, access control, appointment flow, insurance capture, reporting, and database-backed workflows.

### Prototype Goals

- Validate that patients can book and follow appointments with doctors.
- Validate that doctors can manage availability and review patient information.
- Validate that reports and medical records can be retrieved by the correct user roles.
- Validate that Spring Security, JWT authentication, CORS, and role permissions work reliably.
- Validate that the application can run locally and in Docker with repeatable seed data.

### Programming Best Practices Applied

The backend is built with Java and Spring Boot. The implementation follows practices aligned with Google Java Style principles:

- meaningful class, method, and variable names;
- focused classes with clear responsibility;
- service classes for business logic;
- repository interfaces for persistence access;
- DTOs for API request and response contracts;
- constructor injection instead of hidden dependency creation;
- enum types for fixed values such as roles and appointment status;
- tests for security behavior that previously caused 403 failures;
- configuration through environment variables where deployment values may change.

The frontend is built with JavaScript, React, and Vite. It follows practices aligned with Google JavaScript Style principles:

- clear module organization by feature and role;
- reusable API client configuration through Axios;
- component state managed with React hooks;
- centralized routing in `App.jsx`;
- small page components for dashboards, reports, appointments, profiles, and records;
- readable constants for repeated options such as insurance providers and status labels;
- production build verification with Vite.

### Selected Design Pattern: Repository Pattern

The selected design pattern is the Repository Pattern. This pattern separates database access from business logic so that controllers and services do not directly manage SQL or persistence details.

In DHAMS, the pattern is applied as follows:

- Controllers receive HTTP requests and return API responses.
- Services contain business rules such as registration, profile updates, appointment handling, and medical record workflows.
- Repositories isolate database access by extending Spring Data JPA repository interfaces.
- Entities represent persisted database state.
- DTOs protect external API contracts from direct entity exposure.

Examples in the project:

- `AuthController` delegates authentication and registration work to `AuthService`.
- `PatientService`, `DoctorService`, `AppointmentService`, and `MedicalRecordService` handle business behavior.
- `UserRepo`, `PatientRepo`, `DoctorRepo`, `AppointmentRepo`, `AvailabilityRepo`, and `MedicalRecordRepo` handle persistence.

This design keeps the prototype maintainable because data access can change without rewriting controllers, and business rules can be tested separately from HTTP routing.

## Phase 3: Dockerization and Version Control

### Dockerization Process

Dockerizing an application means packaging each part of the system with its runtime dependencies so it can run consistently across machines. For DHAMS, the process is:

1. Identify application services: backend, frontend, and database.
2. Create a Dockerfile for each application service.
3. Use multi-stage builds to separate build dependencies from runtime images.
4. Use environment variables for database and server configuration.
5. Expose only required ports.
6. Use Docker Compose to run all services together.
7. Persist database data using a Docker volume.
8. Test the full stack from the browser and API.

### Docker Implementation in DHAMS

DHAMS uses a three-service Docker Compose setup:

| Service | Purpose | Port |
| --- | --- | --- |
| `db` | PostgreSQL database | `5432` |
| `backend` | Spring Boot REST API | `8081` |
| `frontend` | React app served by Nginx | `8082` |

The backend image is built from `backend/Dockerfile`. It uses Maven and Java 21 to build the Spring Boot jar, then runs the jar on a smaller Java runtime image.

The frontend image is built from `frontend/Dockerfile`. It installs Node dependencies, builds the React app, then serves the static files through Nginx.

The frontend Nginx configuration proxies `/api/` requests to the backend container at `http://backend:8081`, allowing the browser to use the same origin for frontend and API calls in Docker.

The database uses the official PostgreSQL image and a persistent `postgres_data` volume so data is not lost every time containers restart.

### Docker Commands

Run the full application with:

```bash
docker compose build
docker compose up
```

Open the application at:

```text
http://localhost:8082
```

Backend API locations:

```text
Frontend proxy: /api
Direct backend: http://localhost:8081
```

The Compose file uses the `seed` Spring profile so the demo database is populated with Rwanda-focused users, doctors, appointments, medical records, insurance details, and notifications.

### Version Control System: SVN

For this assignment, DHAMS will use a local Apache Subversion repository as the VCS evidence. SVN tracks source changes, allows commits with messages, and provides a recoverable history of the application.

Recommended repository structure:

```text
dhams/
  trunk/
  branches/
  tags/
```

Files to include:

- `backend/`
- `frontend/src/`
- `frontend/public/`
- frontend configuration files such as `package.json`, `vite.config.js`, and Docker files;
- `docs/`
- `docker-compose.yml`
- `README.md`
- `vercel.json`

Files and folders to exclude:

- `frontend/node_modules/`
- `frontend/dist/`
- `backend/target/`
- `*.log`
- IDE caches and temporary files
- Docker database volumes

Full SVN setup commands and screenshot evidence points are documented in `docs/version-control-svn.md`.

## Phase 4: Software Test Plan

### Test Objective

The objective is to confirm that DHAMS works correctly for authentication, role-based access, appointment scheduling, availability management, medical records, insurance capture, reports, exports, and Docker deployment.

### Test Scope

Testing covers:

- backend API behavior;
- Spring Security, JWT, CORS, and role access;
- database-backed service workflows;
- React page routing and production build;
- patient, doctor, and admin user journeys;
- Docker Compose startup and seeded data visibility.

### Test Levels

| Level | Purpose | Evidence |
| --- | --- | --- |
| Unit tests | Verify focused logic and configuration behavior | Maven test output |
| Integration checks | Verify API/security behavior with Spring components | Security configuration tests |
| Build tests | Verify frontend and backend compile successfully | Maven and Vite output |
| Manual acceptance tests | Verify complete user journeys in the browser | Screenshots or checklist |
| Docker tests | Verify the system runs in containers | Compose logs and browser check |

### Evidence Commands

Backend tests:

```bash
cd backend
.\mvnw.cmd test
```

Frontend build:

```bash
cd frontend
npm run build
```

Frontend lint, if the local lint setup is stable:

```bash
cd frontend
npm run lint
```

Docker verification:

```bash
docker compose build
docker compose up
```

### Main Test Scenarios

| ID | Area | Scenario | Expected Result |
| --- | --- | --- | --- |
| T01 | Authentication | Patient logs in with valid credentials | JWT token is returned and patient dashboard opens |
| T02 | Authentication | Doctor logs in with valid credentials | JWT token is returned and doctor dashboard opens |
| T03 | Authentication | Admin logs in with valid credentials | JWT token is returned and admin dashboard opens |
| T04 | Authentication | User logs in with invalid password | Controlled 401/403 response is returned |
| T05 | Security | Browser sends login POST from localhost frontend | Request is not blocked by CSRF/CORS |
| T06 | Appointments | Patient books an appointment with an available doctor slot | Appointment is created |
| T07 | Appointments | Patient tries to book an unavailable slot | Request is rejected or slot is not shown |
| T08 | Availability | Doctor creates availability | Availability appears in scheduling flow |
| T09 | Records | Doctor creates or views patient medical records | Records are saved and displayed correctly |
| T10 | Insurance | Patient updates insurance provider and member number | Insurance details persist on profile |
| T11 | Reports | Patient exports report | CSV file downloads with appointments and records |
| T12 | Reports | Doctor exports report | CSV file downloads with appointments and patient summary |
| T13 | Admin | Admin views doctors, patients, and appointments | Admin pages load seeded data |
| T14 | Docker | Compose stack starts successfully | Frontend opens at `http://localhost:8082` |

### Entry Criteria

- Source code is present in the SVN working copy.
- PostgreSQL is available locally or through Docker.
- Required dependencies are installed.
- Seed profile can load demo data.

### Exit Criteria

- Backend tests pass.
- Frontend production build passes.
- Docker Compose stack starts.
- Critical patient, doctor, and admin flows pass manual verification.
- No blocking authentication, CORS, appointment, report, or database errors remain.

## Conclusion

DHAMS satisfies the assignment requirements as a working software prototype with documented best practices, a clear design pattern, Dockerized services, SVN version control setup, and a practical test plan. The system is suitable for demonstration because it includes realistic Rwanda-focused seeded data, role-based workflows, reports, insurance capture, and repeatable deployment steps.
