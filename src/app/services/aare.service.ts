import { httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { APP_ID, APP_VERSION } from '../app-info';

// Aare.guru API (https://aareguru.existenz.ch/): every value can be null at any time.
interface AareGuruResponse {
  aare?: {
    timestamp?: number | null;
    temperature?: number | null;
    flow?: number | null;
  } | null;
}

export interface AareInfo {
  /** Measurement time as epoch milliseconds. */
  timestamp: number | null;
  /** Water temperature in °C. */
  temperature: number | null;
  /** Water flow in m³/s. */
  flow: number | null;
}

const AARE_URL = 'https://aareguru.existenz.ch/v2018/current';
const CITY = 'bern';

@Injectable({ providedIn: 'root' })
export class AareService {
  public readonly current: HttpResourceRef<AareInfo | undefined> = httpResource<AareInfo>(
    () => ({
      url: AARE_URL,
      params: { city: CITY, app: APP_ID, version: APP_VERSION },
    }),
    { parse: (raw) => toAareInfo(raw as AareGuruResponse) },
  );
}

function toAareInfo(response: AareGuruResponse): AareInfo {
  const aare = response.aare;
  return {
    timestamp: typeof aare?.timestamp === 'number' ? aare.timestamp * 1000 : null,
    temperature: aare?.temperature ?? null,
    flow: aare?.flow ?? null,
  };
}
