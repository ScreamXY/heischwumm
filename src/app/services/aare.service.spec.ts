import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { APP_ID, APP_VERSION } from '../app-info';
import { AareService } from './aare.service';

describe('AareService', () => {
  let httpMock: HttpTestingController;
  let service: AareService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AareService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests the current data from Aare.guru with the required app identification', async () => {
    TestBed.tick();

    const request = httpMock.expectOne(
      (req) => req.url === 'https://aareguru.existenz.ch/v2018/current',
    );
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('city')).toBe('bern');
    expect(request.request.params.get('app')).toBe(APP_ID);
    expect(request.request.params.get('version')).toBe(APP_VERSION);

    request.flush({ aare: { timestamp: 1781088000, temperature: 16.1, flow: 146 } });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.current.value()).toEqual({
      timestamp: 1781088000000,
      temperature: 16.1,
      flow: 146,
    });
  });

  it('maps missing values to null because every Aare.guru value can be null', async () => {
    TestBed.tick();

    const request = httpMock.expectOne(
      (req) => req.url === 'https://aareguru.existenz.ch/v2018/current',
    );
    request.flush({});
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.current.value()).toEqual({
      timestamp: null,
      temperature: null,
      flow: null,
    });
  });
});
