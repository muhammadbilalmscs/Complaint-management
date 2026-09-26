# CivicConnect

Personal technical demonstration of a public service complaint portal.

CivicConnect is not affiliated with or endorsed by the European Council or the Council of the European Union.

This repository is being built in phases so each part can be explained in an interview. **Phase 1 is the Angular application and PrimeNG setup.** Login, complaints, the API, PostgreSQL, Keycloak, ActiveMQ, Docker, GitHub Actions, and Azure deployment are not in the project yet.

## Purpose

The project is a small, interview-focused full-stack demonstration. The frontend goal of this phase is to learn PrimeNG with current Angular: standalone components, the Aura theme, and PrimeIcons.

## What Phase 1 contains

```text
frontend/
  src/
    index.html          Document title and viewport
    styles.css          Page background and font
    main.ts             Bootstraps the standalone application
    app/
      app.ts            Root component
      app.html          Toolbar, card, message, and button
      app.css           Shell layout
      app.config.ts     Router and PrimeNG providers
      app.routes.ts     Empty route table, ready for later screens
      app.spec.ts       Shell and button behaviour
```

There is no `NgModule`. The root component imports only the PrimeNG pieces it renders.

## Technology in this phase

| Piece | Version | Why |
| --- | --- | --- |
| Node.js | 22.23.3 or newer in the 22 line, or Node 24.15+ | Angular 22.2 refuses to run on older Node 22 releases. This environment started on Node 22.14.0, which is too old. |
| Angular | 22.2.0 | Latest stable release. It satisfies PrimeNG 22's peer dependency of Angular `^22.1.0`. |
| PrimeNG | 22.1.1 | Current PrimeNG release. |
| PrimeIcons | 8.0.2 | Icon font used by the shell. |
| `@primeuix/themes` | 3.0.1 | Aura theme preset. PrimeNG no longer ships a `primeng.min.css` theme file. |
| `@angular/cdk` | 22.2.0 | Required peer of PrimeNG. Overlay and focus behaviour in later components depend on it. |
| TypeScript | 6.0.x | Selected by the Angular CLI. |
| Vitest | 5.x | Default unit-test runner for a new Angular 22 application. |

The generated application does not install `zone.js`. Angular 22 creates a zoneless app. A button click updates a signal, and Angular refreshes the view from that signal. That is the change-detection model this project will keep.

## PrimeNG components used

Only the components needed to prove the setup:

| Component | Import | What it shows |
| --- | --- | --- |
| Toolbar | `Toolbar` from `primeng/toolbar` | Application header. Start content is an `ng-template` named `start`. |
| Card | `Card` from `primeng/card` | The welcome panel. `header` and `subheader` are inputs. |
| Message | `Message` from `primeng/message` | An info notice, then a success notice after the button click. `severity` selects the colour. |
| Button | `ButtonDirective` from `primeng/button` | `pButton` on a native `<button>`. The label and icon are normal child elements. |
| PrimeIcons | `primeicons/primeicons.css` | Classes such as `pi pi-building` and `pi pi-check`. |

`Button` still exists as a component, but PrimeNG 22 marks it deprecated. New code uses the `pButton` directive.

Theming is configured once in `app.config.ts`:

- `providePrimeNG` registers PrimeNG for the whole application.
- `definePreset(Aura, ...)` copies Aura and replaces the primary palette with blue.
- `darkModeSelector: false` keeps the portal in light mode.
- `inputVariant: 'outlined'` is the default field style for later forms.
- `ripple: true` is the standard PrimeNG press feedback.

PrimeNG 22 is distributed under the PrimeUI license, not MIT. A free Community license is available to individuals. Add the key locally in `providePrimeNG` and do not commit it:

```typescript
providePrimeNG({
  license: 'YOUR-COMMUNITY-KEY',
  // theme and other options stay as they are
});
```

No key is stored in this repository. Without one, the running app shows a red banner at the bottom right: **Invalid PrimeUI License**. The components still render and the setup check still works. Do not hide that banner in CSS. PrimeNG 21 and earlier remain MIT if a public demo cannot use a license key.

## Commands used to create the application

These were verified against the npm registry on 26 September 2026.

```bash
# Angular CLI 22.2 requires Node ^22.22.3 or ^24.15.0.
nvm install 22.23.3
nvm use 22.23.3

npx -y @angular/cli@22.2.0 new civic-connect \
  --directory frontend \
  --routing \
  --style css \
  --ssr false \
  --skip-git \
  --package-manager npm \
  --ai-config none \
  --defaults \
  --strict \
  --standalone

cd frontend
npm install primeng@22.1.1 @primeuix/themes@3.0.1 primeicons@8.0.2 @angular/cdk@22.2.0
```

`--ssr false` keeps a browser application, which is the shape later used for Azure Static Web Apps. `--skip-git` avoids a second Git repository inside this one. Standalone components and strict templates are the CLI defaults and are set explicitly so the command stays readable.

## Local setup

```bash
cd frontend
nvm use
npm install
npm start
```

Open `http://localhost:4200/`.

`angular.json` sets `cli.analytics` to `false`, so the first `ng serve` does not stop to ask about usage statistics.

Other commands:

```bash
npm run build    # production build in dist/
npm test         # Vitest, watch mode
npx ng test --watch=false
```

## How to verify Phase 1

1. `npm start` and open the app.
2. The header reads **CivicConnect** and **Public Service Complaint Portal**.
3. The icon beside the title is the PrimeIcons building icon.
4. The card, info message, and blue **Check PrimeNG** button use the Aura theme.
5. Click **Check PrimeNG**. A green success message appears under the button.
6. `npx ng test --watch=false` passes.
7. `npm run build` completes.

## Known limitations

- There is no login, complaint list, API, database, messaging, Docker, or deployment yet.
- PrimeNG 22 shows a red **Invalid PrimeUI License** banner until a Community or Commercial key is added locally in `providePrimeNG`.
- The route table is empty. The shell is the root component, not a routed feature.
- Unit tests use Vitest and jsdom. Cypress is a later phase.
- The production bundle is about 517 kB because PrimeNG injects its styled theme. The Angular starter budget warning of 500 kB was raised to 600 kB. The build still fails above 1 MB.
