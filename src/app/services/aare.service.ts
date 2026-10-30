import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { epochSecondsToMilliseconds } from '../shared/time';

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

export const AARE_URL = 'https://aareguru.existenz.ch/v2018/current';
const CITY = 'bern';
// Aare.guru asks every client to send an "app" and a "version" parameter.
const APP_ID = 'ch.schwumm.heischwumm';
const APP_VERSION = '2.0.0';

@Injectable({ providedIn: 'root' })
export class AareService {
  public readonly current = httpResource<AareInfo>(
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
    timestamp: epochSecondsToMilliseconds(aare?.timestamp),
    temperature: aare?.temperature ?? null,
    flow: aare?.flow ?? null,
  };
}
