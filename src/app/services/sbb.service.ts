import { httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Swiss public transport API (https://transport.opendata.ch/). Note that the
// official SBB data portal (https://data.sbb.ch/) offers no journey-planner
// API — its real-time dataset only covers the previous day and SBB-operated
// trains — so connections are queried from transport.opendata.ch instead.
export interface SbbStation {
  name: string | null;
}

export interface SbbEndpoint {
  station: SbbStation;
  /** Epoch seconds. */
  departureTimestamp: number | null;
  /** Epoch seconds. */
  arrivalTimestamp: number | null;
  /** Delay in minutes. */
  delay: number | null;
  platform: string | null;
}

export interface SbbConnection {
  from: SbbEndpoint;
  to: SbbEndpoint;
}

export interface SbbConnectionsResponse {
  connections: SbbConnection[];
}

export interface SbbQuery {
  from: string;
  to: string;
}

const CONNECTIONS_URL = 'https://transport.opendata.ch/v1/connections';
const CONNECTION_LIMIT = 2;
const CONNECTION_PAGE = 0;

@Injectable({ providedIn: 'root' })
export class SbbService {
  /**
   * Creates a resource that loads connections whenever `query` yields a value.
   * Must be called in an injection context (e.g. a component field initializer).
   */
  public connections(
    query: () => SbbQuery | null,
  ): HttpResourceRef<SbbConnectionsResponse | undefined> {
    return httpResource<SbbConnectionsResponse>(() => {
      const params = query();
      if (!params) {
        return undefined;
      }
      return {
        url: CONNECTIONS_URL,
        params: {
          from: params.from,
          to: params.to,
          limit: CONNECTION_LIMIT,
          page: CONNECTION_PAGE,
        },
      };
    });
  }
}
