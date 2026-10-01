# CivicConnect – Public Service Complaint Portal

Personal technical demonstration for a Full Stack Developer role using .NET, Angular, and PrimeNG.

Webiste for testing 

[CivicConnect Complaint Management System](https://civicconnect-afc7hqhsdsa8fzhp.westus3-01.azurewebsites.net/)

This project is not affiliated with or endorsed by the European Council or the Council of the European Union.

## Status

Phase 4 is complete: the Angular app reads and creates complaints through an ASP.NET Core API, and Entity Framework Core stores them in PostgreSQL. Authentication, ActiveMQ, Docker, and Azure database hosting are later phases.

## Technology in this phase

- Angular 22.2
- TypeScript
- PrimeNG 22.1
- PrimeIcons 8 (`@primeicons/angular`)
- Aura theme (`@primeuix/themes`)

## PrimeNG setup

PrimeNG is registered once in `frontend/src/app/app.config.ts` with `providePrimeNG`. Components are imported only in the standalone component that uses them. There is no global `primeng.min.css`; the Aura preset supplies the styles.

PrimeNG 22 expects a PrimeUI license key. A free Community license is available for individuals at [primeui.dev/licenses/community](https://primeui.dev/licenses/community). Put your key in `frontend/src/environments/environment.ts` and do not commit it. The application still starts when the key is empty; PrimeNG may show a license notice until a valid key is set.

## Local setup

Requirements: Node.js 24 and npm 11.

```powershell
cd frontend
npm install
npm start
```

Open http://localhost:4200/ after the API is running. The complaints table and dashboard load from PostgreSQL. New Complaint opens a dialog. Saving a valid complaint sends it to the API, shows a success toast, and adds the row to the table. The row is still there after a browser refresh.

## Phase 4 – ASP.NET Core API + PostgreSQL

The backend is one ASP.NET Core Web API project. It uses Entity Framework Core and the Npgsql provider. There is no authentication in this phase.

- .NET 10 (`net10.0`), the installed LTS SDK
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- Swagger UI in Development

The browser always calls `/api` on the same host. Local `ng serve` forwards `/api` to `http://localhost:5000`. On Azure the API is that same site, so the deployed app does not call localhost.

### API endpoints

| Method | Path | Success |
| --- | --- | --- |
| GET | `/api/complaints` | 200 and the complaint list |
| GET | `/api/complaints/{id}` | 200, or 404 when the id is missing |
| POST | `/api/complaints` | 201 Created |
| PUT | `/api/complaints/{id}` | 200, or 404 when the id is missing |
| DELETE | `/api/complaints/{id}` | 204, or 404 when the id is missing |

POST requires title, description, category, and priority. The API sets status to Open, sets the created time, and records the complaint for Demo User. An invalid body returns 400.

### Configure PostgreSQL

Install PostgreSQL and create a database named `civicconnect`. Copy the example settings and put your local password in the copy. That file is gitignored.

```powershell
Copy-Item backend\CivicConnect.Api\appsettings.Development.example.json backend\CivicConnect.Api\appsettings.Development.json
```

You can set the same value without editing the file:

```powershell
$env:ConnectionStrings__DefaultConnection = "Host=localhost;Port=5432;Database=civicconnect;Username=postgres;Password=YOUR_PASSWORD"
```

Do not commit a real password.

### Run migrations and start the API

From the repository root:

```powershell
cd backend
dotnet tool restore
dotnet restore CivicConnect.Api
dotnet ef database update --project CivicConnect.Api --startup-project CivicConnect.Api
dotnet run --project CivicConnect.Api --launch-profile http
```

`dotnet run` applies pending migrations and, when the complaints table is empty, inserts the original sample rows.

- API: http://localhost:5000
- Swagger: http://localhost:5000/swagger

### Start Angular

In a second terminal:

```powershell
cd frontend
npm install
npm start
```

Open http://localhost:4200/. The complaint list requests `GET /api/complaints`, which the dev server forwards to the API. Saving the New Complaint dialog sends `POST /api/complaints`, then reloads the list. If the API is down, the page shows an error toast and does not invent a saved complaint. If saving fails, the dialog stays open.

```powershell
cd frontend
npm test
npm run build
```

### Azure

A push to `main` builds the Angular app, publishes the API with those files, and deploys that package to the CivicConnect App Service. The workflow switches the Linux stack to `DOTNETCORE|10.0` and starts `dotnet CivicConnect.Api.dll`.

The API uses PostgreSQL when `ConnectionStrings__DefaultConnection` is set. On Azure that value is empty unless you add the App Setting or the GitHub secret `POSTGRES_CONNECTION_STRING`. In that case the same App Service stores complaints in a SQLite file under the app's home directory, so a separate database is not required for the site to run. Do not commit a database password.
