import { Page } from '@playwright/test';

export const AARE_RESPONSE = {
  aare: {
    timestamp: 1781088000,
    temperature: 16.1,
    flow: 146,
  },
};

export const FORECAST_RESPONSE = {
  current: {
    temperature_2m: 14.27,
    relative_humidity_2m: 78,
    pressure_msl: 1019,
    wind_speed_10m: 2.24,
    weather_code: 61,
    is_day: 1,
  },
  daily: {
    temperature_2m_max: [15.64],
    temperature_2m_min: [13.61],
    sunrise: [1781062538],
    sunset: [1781119430],
  },
};

export function connectionsResponse(from: string, to: string) {
  return {
    connections: [
      {
        from: {
          station: { name: from },
          departureTimestamp: 1781088960,
          arrivalTimestamp: null,
          delay: 1,
          platform: '1',
        },
        to: {
          station: { name: to },
          departureTimestamp: null,
          arrivalTimestamp: 1781090280,
          delay: null,
          platform: '4',
        },
      },
      {
        from: {
          station: { name: from },
          departureTimestamp: 1781090700,
          arrivalTimestamp: null,
          delay: null,
          platform: '1',
        },
        to: {
          station: { name: to },
          departureTimestamp: null,
          arrivalTimestamp: 1781091960,
          delay: null,
          platform: '4',
        },
      },
    ],
  };
}

export async function mockApis(page: Page): Promise<void> {
  await page.route('https://aareguru.existenz.ch/v2018/current*', (route) =>
    route.fulfill({ json: AARE_RESPONSE }),
  );
  // ** because the query string contains a literal slash (timezone=Europe/Zurich).
  await page.route('https://api.open-meteo.com/v1/forecast**', (route) =>
    route.fulfill({ json: FORECAST_RESPONSE }),
  );
  await page.route('https://transport.opendata.ch/v1/connections*', (route) => {
    const url = new URL(route.request().url());
    const from = url.searchParams.get('from') ?? '';
    const to = url.searchParams.get('to') ?? '';
    return route.fulfill({ json: connectionsResponse(from, to) });
  });
}

/** Formats an epoch-seconds timestamp like the app does (HH:mm, local time). */
export function localTime(timestampSeconds: number): string {
  return new Intl.DateTimeFormat('de-CH', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(timestampSeconds * 1000));
}
