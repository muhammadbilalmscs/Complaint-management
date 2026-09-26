# CivicConnect – Public Service Complaint Portal

Personal technical demonstration for a Full Stack Developer role using .NET, Angular, and PrimeNG.

This project is not affiliated with or endorsed by the European Council or the Council of the European Union.

## Status

Phase 2 is complete: the portal shell and a complaint list backed by mock data.

Later phases add the create-complaint dialog, the ASP.NET Core API, PostgreSQL, authentication, ActiveMQ, Docker, GitHub Actions, and Azure deployment notes.

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

Open http://localhost:4200/. You should see the CivicConnect header and a complaints table filled with sample rows. Search, status, and category filter that table. Dashboard shows a short summary of the same sample data.

```powershell
cd frontend
npm test
npm run build
```
