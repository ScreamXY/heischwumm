import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { WeatherService } from './weather.service';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const FORECAST_RESPONSE = {
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

describe('WeatherService', () => {
  let httpMock: HttpTestingController;
  let service: WeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(WeatherService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests the Open-Meteo forecast for Bern and maps it to the weather view', async () => {
    TestBed.tick();

    expect(service.loading()).toBe(true);

    const request = httpMock.expectOne((req) => req.url === FORECAST_URL);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('latitude')).toBe('46.9481');
    expect(request.request.params.get('longitude')).toBe('7.4474');
    expect(request.request.params.get('current')).toContain('temperature_2m');
    expect(request.request.params.get('current')).toContain('weather_code');
    expect(request.request.params.get('daily')).toContain('sunrise');
    expect(request.request.params.get('timeformat')).toBe('unixtime');

    request.flush(FORECAST_RESPONSE);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.loading()).toBe(false);
    expect(service.weather()).toEqual({
      name: 'Bern',
      description: 'Leichter Regen',
      icon: '10d',
      sunrise: 1781062538000,
      sunset: 1781119430000,
      temperature: 14.27,
      temperatureMax: 15.64,
      temperatureMin: 13.61,
      pressure: 1019,
      humidity: 78,
      windSpeed: 2.24,
    });
  });

  it('uses the night icon variant when it is not day', async () => {
    TestBed.tick();

    httpMock
      .expectOne((req) => req.url === FORECAST_URL)
      .flush({
        current: { weather_code: 0, is_day: 0 },
      });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.weather()?.icon).toBe('01n');
    expect(service.weather()?.description).toBe('Klarer Himmel');
  });

  it('maps unknown weather codes and missing values to empty/null', async () => {
    TestBed.tick();

    httpMock
      .expectOne((req) => req.url === FORECAST_URL)
      .flush({
        current: { weather_code: 42 },
      });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.weather()).toEqual({
      name: 'Bern',
      description: '',
      icon: null,
      sunrise: null,
      sunset: null,
      temperature: null,
      temperatureMax: null,
      temperatureMin: null,
      pressure: null,
      humidity: null,
      windSpeed: null,
    });
  });

  it('returns null while the forecast has not been loaded', async () => {
    TestBed.tick();

    httpMock
      .expectOne((req) => req.url === FORECAST_URL)
      .flush('failed', { status: 500, statusText: 'Server Error' });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.weather()).toBeNull();
    expect(service.loading()).toBe(false);
  });

  it('requests the forecast again on reload()', async () => {
    TestBed.tick();

    httpMock.expectOne((req) => req.url === FORECAST_URL).flush(FORECAST_RESPONSE);
    await TestBed.inject(ApplicationRef).whenStable();

    service.reload();
    TestBed.tick();

    httpMock.expectOne((req) => req.url === FORECAST_URL).flush(FORECAST_RESPONSE);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.weather()).not.toBeNull();
  });
});
