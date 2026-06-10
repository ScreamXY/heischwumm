import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CONNECTIONS_URL, SbbConnectionsResponse, SbbQuery, SbbService } from './sbb.service';

const CONNECTIONS_RESPONSE: SbbConnectionsResponse = {
  connections: [
    {
      from: {
        station: { name: 'Gümligen' },
        departureTimestamp: 1781088960,
        arrivalTimestamp: null,
        delay: 1,
        platform: '1',
      },
      to: {
        station: { name: 'Thun' },
        departureTimestamp: null,
        arrivalTimestamp: 1781090280,
        delay: null,
        platform: '4',
      },
    },
  ],
};

describe('SbbService', () => {
  let httpMock: HttpTestingController;
  let service: SbbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SbbService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests connections with the given from/to and a limit of 2', async () => {
    const resource = TestBed.runInInjectionContext(() =>
      service.connections(() => ({ from: 'Gümligen', to: 'Thun' })),
    );
    TestBed.tick();

    const request = httpMock.expectOne((req) => req.url === CONNECTIONS_URL);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('from')).toBe('Gümligen');
    expect(request.request.params.get('to')).toBe('Thun');
    expect(request.request.params.get('limit')).toBe('2');
    expect(request.request.params.get('page')).toBe('0');

    request.flush(CONNECTIONS_RESPONSE);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(resource.value()).toEqual(CONNECTIONS_RESPONSE);
  });

  it('does not request anything while the query is null', () => {
    const resource = TestBed.runInInjectionContext(() => service.connections(() => null));
    TestBed.tick();

    httpMock.expectNone((req) => req.url === CONNECTIONS_URL);
    expect(resource.hasValue()).toBe(false);
  });

  it('requests again when the query changes', async () => {
    const query = signal<SbbQuery | null>(null);
    TestBed.runInInjectionContext(() => service.connections(query));
    TestBed.tick();
    httpMock.expectNone((req) => req.url === CONNECTIONS_URL);

    query.set({ from: 'Bern', to: 'Muri bei Bern' });
    TestBed.tick();

    const request = httpMock.expectOne((req) => req.url === CONNECTIONS_URL);
    expect(request.request.params.get('to')).toBe('Muri bei Bern');
    request.flush(CONNECTIONS_RESPONSE);
    await TestBed.inject(ApplicationRef).whenStable();
  });
});
