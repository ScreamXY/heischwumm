# Heischwumm

A small dashboard for deciding whether to swim home: SBB connections from
Gümligen, the weather in Bern and the current Aare water temperature and flow.

Originally written in AngularJS 1.5 (2016), rewritten in Angular 22 with
standalone components, signals and `httpResource` — the design is unchanged.

## Development

Requires Node 26 (see `.nvmrc`).

```sh
npm install
npm start          # dev server on http://localhost:4200
npm test           # unit tests (Vitest)
npm run e2e        # end-to-end tests (Playwright, APIs mocked)
npm run lint       # ESLint
npm run format     # Prettier
npm run build      # production build
```

## CI & Deployment

The [CI workflow](.github/workflows/ci.yml) typechecks (`tsc -b`), lints,
runs the unit and e2e tests and builds on every push and pull request.

The app is served by GitHub Pages at <https://screamxy.github.io/heischwumm/>.
Every push to `master` runs the [Deploy workflow](.github/workflows/deploy.yml),
which builds with `--base-href /heischwumm/` and publishes the output through
the repo's own GitHub Pages (source: GitHub Actions). No secrets or deploy
keys are needed.

The root of <https://screamxy.github.io> is the ScreamXY portal
([ScreamXY/screamxy.github.io](https://github.com/ScreamXY/screamxy.github.io)),
which links to this app and hosts its support and privacy pages at
`/apps/heischwumm/`. Old bookmarks of the form `screamxy.github.io/#/sbb` are
redirected by the portal.

## APIs

| Data    | Source                                                  | Notes                                                                                                                                                                                                                                                                                                          |
| ------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aare    | [Aare.guru](https://aareguru.existenz.ch/)              | Sends the required `app`/`version` parameters; the UI links back to [aare.guru](https://aare.guru) and the [BAFU](https://www.hydrodaten.admin.ch) as their terms request.                                                                                                                                     |
| Weather | [Open-Meteo](https://open-meteo.com/)                   | Free for non-commercial use, no API key, CORS-enabled. For Switzerland the forecast comes from MeteoSwiss' ICON-CH models. The data is CC BY 4.0, so the weather card links back to open-meteo.com. WMO weather codes are mapped to the app's original icon set in `weather.service.ts`.                       |
| SBB     | [transport.opendata.ch](https://transport.opendata.ch/) | The official [SBB data portal](https://data.sbb.ch/) offers no journey-planner API — its real-time dataset (`ist-daten-sbb`) only covers the previous day, only SBB-operated trains (the Gümligen S1 is BLS) and has no platform information — so connections come from the Opendata.ch transport API instead. |

## Routes

- `#/` — the dashboard (auto-reloads every 5 minutes)
- `#/sbb` — free connection search between any two stations
