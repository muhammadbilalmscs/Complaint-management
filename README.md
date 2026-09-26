# CivicConnect – Public Service Complaint Portal

Personal technical demonstration for a Full Stack Developer role using .NET, Angular, and PrimeNG.

This project is not affiliated with or endorsed by the European Council or the Council of the European Union.

## Status

Phase 3 is complete: the complaint list and a New Complaint dialog built with reactive forms. The Angular app can be hosted on Azure Static Web Apps with the in-memory sample complaints. There is no API yet.

Later phases add the ASP.NET Core API, PostgreSQL, authentication, ActiveMQ, Docker, broader GitHub Actions, and the rest of the Azure deployment.

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

Open http://localhost:4200/. You should see the CivicConnect header and a complaints table filled with sample rows. New Complaint opens a dialog. Saving a valid complaint shows a success toast and adds the row to the table. Dashboard counts the same in-memory list.

```powershell
cd frontend
npm test
npm run build
```
